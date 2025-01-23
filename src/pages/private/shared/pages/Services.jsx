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
import { createData } from "@/lib/utils/createData";
import useAuth from "@/hooks/useAuth";

const Services = () => {
  const { name, branch, clearServiceForm } = useServiceForm((state) => state);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    auth: { accessToken },
  } = useAuth();

  const { branches, services, triggerUpdate } = useAppContext();
  const branchesList = [...new Set(branches?.map((branch) => branch))];

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
    setMessage("");
  };

  const createService = async () => {
    setLoading(true);
    setMessage("");

    if (!name || !branch) {
      setMessage("All fields are required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (name.length < 3) {
      setMessage("Service name must be at least 3 characters long");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await createData(
        "service",
        { name, branch },
        accessToken
      );

      if (message) {
        setMessage(message.text);
        setMessageType(message.type);
      }

      if (data) {
        console.log("Service created successfully:", data);
        clearServiceForm();
        triggerUpdate("service");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      setMessage(message?.text);
      setMessageType(message?.type);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="service"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createService}
        message={message}
        messageType={messageType}
        loading={loading}
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
