import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import ViewItemModal from "../../../../components/common/ViewItemModal";
import { useBranchForm } from "../../../../lib/store/PageForms";

const BranchManagement = () => {
  const {
    isModalOpen,
    currentForm,
    openModal,
    closeModal,
    // viewItem,
    // editItem,
    isViewModalOpen,
    closeViewModal,
  } = useAppContext();

  const { name, location, status, clearBranchForm } = useBranchForm(
    (state) => state
  );

  const createBranch = () => {
    console.log("Branch:", { name, location, status });
  };

  const onClose = () => {
    closeModal();
    clearBranchForm();
  };

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createBranch}
      />

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
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
    </>
  );
};
export default BranchManagement;
