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
import { createData } from "@/lib/utils/createData";
import useAuth from "@/hooks/useAuth";

const StaffManagement = () => {
  const { name, email, password, branch, clearStaffForm } = useStaffForm(
    (state) => state
  );

  const {
    auth: { accessToken },
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { branches, staff, triggerUpdate, setAlert } = useAppContext();
  const branchesList = [...new Set(branches?.map((branch) => branch))];

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
    setLoading(true);
    setAlert((prev) => ({
      ...prev,
      message: "",
    }));

    if (!name || !email || !password || !branch) {
      setAlert((prev) => ({
        ...prev,
        message: "All fields are required",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert((prev) => ({
        ...prev,
        message: "Invalid email format",
        type: "error",
      }));
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await createData(
        "staff",
        { name, email, password, branch, role: "staff" },
        accessToken
      );

      if (message) {
        setAlert((prev) => ({
          ...prev,
          message: message.text,
          type: message?.type,
        }));
      }

      if (data) {
        console.log("Staff created successfully:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Staff created successfully",
          type: "success",
        }));
        onClose();
        triggerUpdate("staff");
        clearStaffForm();
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      setAlert((prev) => ({
        ...prev,
        message: "An unexpected error occurred. Please try again later.",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    clearStaffForm();
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="staff"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createStaff}
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

      <div className="w-screen sm:w-full overflow-auto">
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
