import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { useStaffForm } from "../../../../lib/store/PageForms";

const StaffManagement = () => {
  const { isModalOpen, currentForm, openModal, closeModal } = useAppContext();

  const { name, email, password, branch, clearStaffForm } = useStaffForm(
    (state) => state
  );

  const createStaff = () => {
    console.log("Staff:", { name, email, password, branch });
  };
  const onClose = () => {
    closeModal();
    clearStaffForm();
  };

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createStaff}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="font-[700] text-[25px] capitalize mb-3 sm:mb-0">
          Staff Management
        </h1>

        <CustomButton
          label="Add Staff"
          icon={<Plus />}
          variant="contained"
          onClick={() => openModal("Staff")}
        />
      </div>
    </>
  );
};
export default StaffManagement;
