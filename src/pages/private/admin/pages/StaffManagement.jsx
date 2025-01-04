import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";

const StaffManagement = () => {
  const { isModalOpen, currentForm, openModal, closeModal } = useAppContext();
  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        section={currentForm || ""}
        onSubmit={() => console.log(`submitting ${currentForm} form`)}
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
