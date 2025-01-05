import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import ViewItemModal from "../../../../components/common/ViewItemModal";

const BranchManagement = () => {
  const {
    isModalOpen,
    currentForm,
    openModal,
    closeModal,
    viewItem,
    editItem,
    isViewModalOpen,
    closeViewModal,
  } = useAppContext();

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        section={currentForm || ""}
        onSubmit={() => console.log(`submitting ${currentForm} form`)}
      />

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
        // onSubmit={() => console.log(`submitting ${currentForm} form`)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="font-[700] text-[25px] capitalize mb-3 sm:mb-0">
          Branch Management
        </h1>

        <CustomButton
          label="Add Branch"
          icon={<Plus />}
          variant="contained"
          onClick={() => openModal("Branch")}
        />
      </div>

      <CustomButton
        label="View Branch"
        variant="contained"
        onClick={() => viewItem("Branch")}
      />
      <CustomButton
        label="Edit Branch"
        variant="contained"
        onClick={() => editItem("Branch")}
      />
    </>
  );
};
export default BranchManagement;
