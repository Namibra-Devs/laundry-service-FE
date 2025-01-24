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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    auth: { accessToken },
  } = useAuth();

  const { branches, items, triggerUpdate } = useAppContext();
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
    setMessage("");

    if (!itemName) {
      setMessage("Item name is required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (prices.length === 0) {
      setMessage("Add at least one price");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (itemName.length < 3) {
      setMessage("Item name must be at least 3 characters long");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const invalidPrices = prices.filter(
      (price) => !price.washingPrice || !price.ironingPrice || !price.branch
    );

    if (invalidPrices.length > 0) {
      setMessage(
        "Each price entry must have washing price, ironing price, and a branch specified"
      );
      setMessageType("error");
      setLoading(false);
      return;
    }

    const pricing = prices.map((price) => ({
      washingPrice: price?.washingPrice,
      ironingPrice: price?.ironingPrice,
      branch: price?.branch,
    }));

    try {
      const { data, message } = await createData(
        "item",
        { name: itemName, pricing },
        accessToken
      );

      if (message) {
        setMessage(message.text);
        setMessageType(message.type);
      }

      if (data) {
        console.log("Item created successfully:", data);
        clearItemForm();
        triggerUpdate("item");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      setMessage(message?.text);
      setMessageType(message?.type);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    clearItemForm();
    setMessage("");
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
        message={message}
        messageType={messageType}
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
        {/* <ItemsTable
          onViewClick={onViewClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          items={itemsData}
          branchesList={branchesList}
        /> */}
      </div>
    </>
  );
};
export default Items;
