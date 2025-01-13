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
import useFetchAllItems from "@/hooks/useFetchAllItems";
import { BranchesData } from "@/lib/data/branchesData";
import { useEffect } from "react";
import axios from "@/api/axios";

const BranchManagement = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // const branches = useFetchAllItems("branch");

  const branchesData = BranchesData?.reverse();

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

  const onEditClick = (branchItem) => {
    editItem("Branch");
    setCurrentItem(branchItem);
  };

  const { name, location, status, clearBranchForm } = useBranchForm(
    (state) => state
  );

  const {
    auth: { accessToken, user },
  } = useAuth();

  useEffect(() => {
    const getBranches = async () => {
      try {
        const response = await axios.get(`/api/branches/user/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response?.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBranches();
  }, [user?.id, accessToken]);

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
      } else {
        console.error("Error:", message?.text);
      }

      setMessageType("success");
      setMessage(message?.text);
      clearBranchForm();
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
    <>
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

      <BranchTable onEditClick={onEditClick} branches={branchesData} />
    </>
  );
};
export default BranchManagement;
