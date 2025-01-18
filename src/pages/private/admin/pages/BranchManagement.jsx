import { Plus } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import ViewItemModal from "../../../../components/common/ViewItemModal";
import { useBranchForm } from "../../../../lib/store/PageForms";
import DeleteAlert from "@/components/common/DeleteAlert";
import { BranchTable } from "../components/branch/BranchTable";
import { useState } from "react";
import { useEffect } from "react";

const BranchManagement = () => {
  const { name, location, status, clearBranchForm } = useBranchForm(
    (state) => state
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedId, setSelectedId] = useState(null);

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
    if (!name || !location || !status) {
      setMessageType("error");
      setMessage("All fields are required");
      return;
    }

    setMessageType("");
    setMessage("");
    clearBranchForm();
    console.log({ name, location, status });
  };

  const onClose = () => {
    closeModal();
    clearBranchForm();
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Branch"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createBranch}
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
