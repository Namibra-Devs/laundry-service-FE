import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import ViewItemModal from "@/components/common/ViewItemModal";
import DeleteAlert from "@/components/common/DeleteAlert";
import { useState, useCallback } from "react";
import { StaffTable } from "../components/staff/StaffTable";
import { useStaffForm } from "../../../../lib/store/PageForms";
import { useEffect } from "react";

const StaffManagement = () => {
  const { name, email, password, branch, clearStaffForm } = useStaffForm(
    (state) => state
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { branches, staff } = useAppContext();
  const branchesList = [...new Set(branches.map((branch) => branch.name))];

  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    if (Array.isArray(staff)) {
      const reversedStaff = [...staff].reverse();
      setStaffData(reversedStaff);
    }
  }, [staff]);

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
    deleteModal,
    setDeleteModal,
  } = useAppContext();

  const onEditClick = useCallback(
    (staffItem) => {
      editItem("Staff");
      setCurrentItem(staffItem);
    },
    [editItem, setCurrentItem]
  );

  const onDeleteClick = useCallback(
    (id) => {
      setSelectedId(id);
      setDeleteModal(true);
    },
    [setDeleteModal]
  );

  const createStaff = async () => {
    if (!name || !email || !password || !branch) {
      setMessageType("error");
      setMessage("All fields are required");
      return;
    }

    setMessageType("");
    setMessage("");
    clearStaffForm();
    console.log({ name, email, password, branch });
  };

  const onClose = () => {
    closeModal();
    clearStaffForm();
    setMessage("");
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Staff"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createStaff}
        message={message}
        messageType={messageType}
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
        <StaffTable
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          staff={staffData}
          branchesList={branchesList}
        />
      </div>
    </div>
  );
};

export default StaffManagement;
