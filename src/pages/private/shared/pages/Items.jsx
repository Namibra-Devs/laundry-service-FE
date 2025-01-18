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

const Items = () => {
  const [selectedId, setSelectedId] = useState(null);

  const { branches, items } = useAppContext();
  const branchesList = [...new Set(branches.map((branch) => branch.name))];

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

  const createItem = () => {
    console.log("Item", { name: itemName, prices });
  };

  const onClose = () => {
    closeModal();
    clearItemForm();
  };

  return (
    <>
      <DeleteAlert
        page="Service"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createItem}
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

      <ItemsTable
        onViewClick={onViewClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        items={itemsData}
        branchesList={branchesList}
      />
    </>
  );
};
export default Items;
