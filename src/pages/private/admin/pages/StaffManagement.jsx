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
import DeleteAlert from "@/components/common/DeleteAlert";
import axios from "@/api/axios";
import { useEffect } from "react";

const StaffManagement = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const { name, email, password, branch, clearStaffForm } = useStaffForm(
    (state) => state
  );

  const { staff } = useAppContext();
  const [staffData, setStaffData] = useState([]);

  const { branches } = useAppContext();
  const branchesList = [...new Set(branches?.map((branch) => branch?._id))];

  useEffect(() => {
    if (Array.isArray(staff)) {
      const reversedBranches = [...staff].reverse();
      setStaffData(reversedBranches);
    }
  }, [staff]);

  const {
    auth: { accessToken },
  } = useAuth();

  const refetchStaff = async () => {
    try {
      console.log("Refetching staff...");
      const response = await axios.get(`/api/staffs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedData = response?.data?.data;
      setStaffData([...fetchedData].reverse());
      console.log("Fetched Data:", fetchedData);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

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

  const onEditClick = (staffItem) => {
    editItem("Staff");
    setCurrentItem(staffItem);
  };

  const onDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const createStaff = async () => {
    setMessage("");
    setLoading(true);

    if (!name || !email || !password || !branch) {
      setMessageType("error");
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await createData(
        "staff",
        { name, email, password, branch, role: "staff" },
        accessToken
      );

      if (message?.type === "success") {
        console.log("Success:", data);
        await refetchStaff();
        setMessageType("success");
        setMessage(message?.text);
        clearStaffForm();
      } else {
        console.error("Error:", message?.text);
        setMessageType("error");
        setMessage(message?.text);
      }

      if (data) {
        console.log(data);
      }

      // setMessageType("success");
      // setMessage(message?.text);
      // clearStaffForm();
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessageType("error");
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    clearStaffForm();
    setLoading(false);
    setMessage("");
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Staff"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
        refetchFunction={refetchStaff}
      />

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
        loading={loading}
        refetchFunction={refetchStaff}
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
