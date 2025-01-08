import CustomButton from "../../../../components/CustomButton";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { Plus } from "lucide-react";
import useAppContext from "../../../../hooks/useAppContext";
import { useServiceForm } from "../../../../lib/store/PageForms";
import { ServicesTable } from "../components/services/ServicesTable";
import ViewItemModal from "@/components/common/ViewItemModal";

const Services = () => {
  const {
    viewItem,
    editItem,
    setCurrentItemId,
    isViewModalOpen,
    closeViewModal,
    isModalOpen,
    currentForm,
    openModal,
    closeModal,
    currentItemId,
  } = useAppContext();

  const onViewClick = (id) => {
    viewItem("Service");
    setCurrentItemId(id);
  };

  const onEditClick = (id) => {
    editItem("Service");
    setCurrentItemId(id);
  };

  const { name, branch, clearServiceForm } = useServiceForm((state) => state);

  const createService = () => {
    console.log("Service:", { name, branch });
  };
  const onClose = () => {
    closeModal();
    clearServiceForm();
  };

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createService}
      />

      <ViewItemModal
        isModalOpen={isViewModalOpen}
        onClose={closeViewModal}
        section={currentForm || ""}
        currentItemId={currentItemId}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h1 className="font-[700] text-[25px] capitalize">Shop</h1>
          <p>
            Shop <span className="text-custom_yellow_dark">~ Service</span>
          </p>
        </div>

        <CustomButton
          label="Add Service"
          icon={<Plus />}
          variant="contained"
          onClick={() => openModal("Service")}
        />
      </div>

      <ServicesTable onViewClick={onViewClick} onEditClick={onEditClick} />
    </>
  );
};
export default Services;
