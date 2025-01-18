import CustomButton from "../../../../components/CustomButton";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { Plus } from "lucide-react";
import useAppContext from "../../../../hooks/useAppContext";
import { useServiceForm } from "../../../../lib/store/PageForms";
import ViewItemModal from "@/components/common/ViewItemModal";
import DeleteAlert from "@/components/common/DeleteAlert";
import { ServicesTable } from "../components/services/ServicesTable";
import { useState } from "react";
import { useEffect } from "react";

const Services = () => {
  const { name, branch, clearServiceForm } = useServiceForm((state) => state);
  const [selectedId, setSelectedId] = useState(null);

  const { branches, services } = useAppContext();
  const branchesList = [...new Set(branches.map((branch) => branch.name))];

  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    if (Array.isArray(services)) {
      const reversed = [...services].reverse();
      setServicesData(reversed);
    }
  }, [services]);

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

  const onEditClick = (serviceItem) => {
    editItem("Service");
    setCurrentItem(serviceItem);
  };

  const onDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const onClose = () => {
    closeModal();
    clearServiceForm();
  };

  const createService = async () => {
    if (!name || !branch) {
      return;
    }

    console.log({ name, branch });
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Service"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />
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
        currentItem={currentItem}
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

      <div className="w-screen sm:w-full overflow-auto">
        <ServicesTable
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          services={servicesData}
          branchesList={branchesList}
        />
      </div>
    </div>
  );
};
export default Services;
