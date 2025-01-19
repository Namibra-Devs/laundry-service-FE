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
import { refetchData } from "@/lib/utils/refetchData";

const StaffManagement = () => {
  const { name, email, password, branch, clearStaffForm } = useStaffForm(
    (state) => state
  );

  const {
    auth: { accessToken, user },
  } = useAuth();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { branches, staff } = useAppContext();
  const branchesList = [...new Set(branches?.map((branch) => branch?.name))];

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
    setMessage("");

    if (!name || !email || !password || !branch) {
      setMessage("All fields are required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format");
      setMessageType("error");
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
        setMessage(message.text);
        setMessageType(message.type);
      }

      if (data) {
        console.log("Staff created successfully:", data);
        refetchData({
          setData: setStaffData,
          accessToken,
          endpoint: `/api/staffs`,
        });
        clearStaffForm();
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      setMessage("An unexpected error occurred. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    clearStaffForm();
    setMessage("");
  };

  const refetchFunction = () => {
    refetchData({
      setData: setStaffData,
      accessToken,
      endpoint: `/api/staffs`,
    });
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Staff"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
        refetchFunction={refetchFunction}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createStaff}
        message={message}
        messageType={messageType}
        loading={loading}
      />

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
        currentItem={currentItem}
        refetchFunction={refetchFunction}
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
