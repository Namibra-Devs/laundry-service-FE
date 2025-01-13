import { Plus } from "lucide-react";
import { useState } from "react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { useStaffForm } from "../../../../lib/store/PageForms";
import { StaffTable } from "../components/staff/StaffTable";
import ViewItemModal from "@/components/common/ViewItemModal";
import { createData } from "@/lib/utils/createData";
import useAuth from "@/hooks/useAuth";

const StaffManagement = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
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

  const {
    auth: { accessToken },
  } = useAuth();

  const createStaff = async () => {
    setMessage("");
    // setLoading(true);

    if (!name || !email || !password || !branch) {
      setMessageType("error");
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    console.log("Staff:", { name, email, password, branch });
    // try {
    //   const { data, message } = await createData(
    //     "branch",
    //     { name, email, password, branch },
    //     accessToken
    //   );

    //   if (message?.type === "success") {
    //     console.log("Success:", data);
    //   } else {
    //     console.error("Error:", message?.text);
    //   }

    //   setMessageType("success");
    //   setMessage(message?.text);
    //   clearStaffForm();
    // } catch (error) {
    //   console.error("Unexpected error:", error);
    //   setMessageType("error");
    //   setMessage("An unexpected error occurred. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };
  const onClose = () => {
    closeModal();
    clearStaffForm();
    setLoading(false);
    setMessage("");
  };

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createStaff}
        messageType={messageType}
        message={message}
        loading={loading}
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
