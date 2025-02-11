import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import useAppContext from "../../../../hooks/useAppContext";
import { useItemsForm } from "../../../../lib/store/PageForms";
import ViewItemModal from "@/components/common/ViewItemModal";
import DeleteAlert from "@/components/common/DeleteAlert";
import { useState } from "react";
import { ItemsTable } from "../components/Items/ItemsTable";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { createData } from "@/lib/utils/createData";

const Items = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    auth: { accessToken },
  } = useAuth();

  const { branches, items, triggerUpdate, setAlert } = useAppContext();
  const branchesList = [...new Set(branches?.map((branch) => branch?.name))];

  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    if (Array.isArray(items)) {
      const reversed = [...items].reverse();
      setItemsData(reversed);
    }
  }, [items]);

  const {
    viewItem,
    editItem,
    setCurrentItem,
    isViewModalOpen,
    closeViewModal,
    isModalOpen,
    currentForm,
    openModal,
    closeModal,
    currentItem,
    deleteModal,
    setDeleteModal,
  } = useAppContext();

  const onViewClick = (item) => {
    viewItem("Item");
    setCurrentItem(item);
  };

  const onEditClick = (item) => {
    editItem("Item");
    setCurrentItem(item);
  };

  const onDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const { itemName, prices, clearItemForm } = useItemsForm((state) => state);

  const createItem = async () => {
    setLoading(true);

    if (!itemName) {
      setAlert((prev) => ({
        ...prev,
        message: "Item Name is required.",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (prices.length === 0) {
      setAlert((prev) => ({
        ...prev,
        message: "Add at least one price",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (itemName.length < 3) {
      setAlert((prev) => ({
        ...prev,
        message: "Name must have at least 3 characters",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    const invalidPrices = prices.filter(
      (price) => !price.washingPrice || !price.ironingPrice || !price.branch
    );

    if (invalidPrices.length > 0) {
      setAlert((prev) => ({
        ...prev,
        message: "Missing item identities",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    const pricing = prices.map((price) => ({
      washingPrice: price?.washingPrice,
      ironingPrice: price?.ironingPrice,
      branch: price?.branch,
    }));

    try {
      // console.log({ itemName, pricing });
      const { data, message } = await createData(
        "item",
        { name: itemName, pricing },
        accessToken
      );

      if (message) {
        setAlert((prev) => ({
          ...prev,
          message: message?.text,
          type: message?.type,
        }));
      }

      if (data) {
        console.log("Item created:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Item Created",
          type: "success",
        }));
        onClose();
        clearItemForm();
        triggerUpdate("item");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      setAlert((prev) => ({
        ...prev,
        message: "An error occurred",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    clearItemForm();
  };

  return (
    <>
      <DeleteAlert
        page="item"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createItem}
        loading={loading}
      />

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
        currentItem={currentItem}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h1 className="font-[700] text-[25px] capitalize">Shop</h1>
          <p>
            Shop <span className="text-custom_yellow_dark">~ Items</span>
          </p>
        </div>

        <CustomButton
          label="Add Item"
          icon={<Plus />}
          variant="contained"
          onClick={() => openModal("Item")}
        />
      </div>

      <div className="w-screen sm:w-full overflow-auto">
        <ItemsTable
          onViewClick={onViewClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          items={itemsData}
          branchesList={branchesList}
        />
      </div>
    </>
  );
};
export default Items;
