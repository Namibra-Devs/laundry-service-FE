import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { useStaffForm } from "../../../../lib/store/PageForms";
import { StaffTable } from "../components/staff/StaffTable";
import ViewItemModal from "@/components/common/ViewItemModal";

const StaffManagement = () => {
  const {
    editItem,
    setCurrentItem,
    isViewModalOpen,
    closeViewModal,
    isModalOpen,
    currentForm,
    openModal,
    closeModal,
    currentItem,
  } = useAppContext();

  const onEditClick = (staffItem) => {
    editItem("Staff");
    setCurrentItem(staffItem);
  };

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

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
        currentItem={currentItem}
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

      <div>
        <StaffTable onEditClick={onEditClick} />
      </div>
    </>
  );
};
export default StaffManagement;
