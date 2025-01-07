import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import useAppContext from "../../../../hooks/useAppContext";
import { useItemsForm } from "../../../../lib/store/PageForms";

const Items = () => {
  const { isModalOpen, currentForm, openModal, closeModal } = useAppContext();

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
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createItem}
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
    </>
  );
};
export default Items;
