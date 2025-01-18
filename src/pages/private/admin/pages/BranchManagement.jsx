import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import ViewItemModal from "../../../../components/common/ViewItemModal";
import { useBranchForm } from "../../../../lib/store/PageForms";
import { BranchTable } from "../components/branch/BranchTable";
import { createData } from "@/lib/utils/createData";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import DeleteAlert from "@/components/common/DeleteAlert";
import axios from "@/api/axios";
import { useEffect } from "react";

const BranchManagement = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const { name, location, status, clearBranchForm } = useBranchForm(
    (state) => state
  );

  const { branches } = useAppContext();
  const [branchesData, setBranchesData] = useState([]);

  useEffect(() => {
    if (Array.isArray(branches)) {
      const reversedBranches = [...branches].reverse();
      setBranchesData(reversedBranches);
    }
  }, [branches]);

  const locations = [
    ...new Set(branchesData?.map((branch) => branch?.location)),
  ];
  const dates = [...new Set(branchesData?.map((branch) => branch?.createdAt))];

  const {
    auth: { accessToken, user },
  } = useAuth();

  const refetchBranches = async () => {
    try {
      console.log("Refetching branches...");
      const response = await axios.get(`/api/branches/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedData = response?.data?.data;
      setBranchesData([...fetchedData].reverse());
      console.log("Fetched Data:", fetchedData);
    } catch (error) {
      console.error("Error fetching branches:", error);
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

  const onEditClick = (branchItem) => {
    editItem("Branch");
    setCurrentItem(branchItem);
  };

  const onDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const createBranch = async () => {
    setMessage("");
    setLoading(true);

    if (!name || !location || !status) {
      setMessageType("error");
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await createData(
        "branch",
        { name, location, status },
        accessToken
      );

      if (message?.type === "success") {
        console.log("Success:", data);
        await refetchBranches();
        setMessageType("success");
        setMessage(message?.text);
        clearBranchForm();
      } else {
        console.error("Error:", message?.text);
        setMessageType("error");
        setMessage(message?.text);
      }
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
    clearBranchForm();
    setLoading(false);
    setMessage("");
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Branch"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
        refetchFunction={refetchBranches}
      />
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createBranch}
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
        refetchFunction={refetchBranches}
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

      <div className="w-screen sm:w-full overflow-auto">
        <BranchTable
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          branches={branchesData}
          locations={locations}
          dates={dates}
        />
      </div>
    </div>
  );
};
export default BranchManagement;
