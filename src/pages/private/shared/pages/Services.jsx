import CustomButton from "../../../../components/CustomButton";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { Plus } from "lucide-react";
import useAppContext from "../../../../hooks/useAppContext";
import { useServiceForm } from "../../../../lib/store/PageForms";
import { ServicesTable } from "../components/services/ServicesTable";
import ViewItemModal from "@/components/common/ViewItemModal";
import DeleteAlert from "@/components/common/DeleteAlert";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import axios from "@/api/axios";
import { createData } from "@/lib/utils/createData";

const Services = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const { name, branch, clearServiceForm } = useServiceForm((state) => state);

  const { services } = useAppContext();
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    if (Array.isArray(services)) {
      const reversedBranches = [...services].reverse();
      setServicesData(reversedBranches);
    }
  }, [services]);

  const { branches } = useAppContext();
  const branchesList = [...new Set(branches?.map((branch) => branch?._id))];

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

  const {
    auth: { accessToken, user },
  } = useAuth();

  const refetchServices = async () => {
    try {
      console.log("Refetching services...");
      const response = await axios.get(`/api/services/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedData = response?.data?.data;
      setServicesData([...fetchedData].reverse());
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const createService = async () => {
    setMessage("");
    setLoading(true);

    if (!name || !branch) {
      setMessageType("error");
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const { data, message } = await createData(
        "service",
        { name, branch },
        accessToken
      );

      if (message?.type === "success") {
        console.log("Success:", data);
        await refetchServices();
        setMessageType("success");
        setMessage(message?.text);
        clearServiceForm();
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

  return (
    <div className="h-screen sm:h-fit">
      <DeleteAlert
        page="Service"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
        refetchFunction={refetchServices}
      />
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createService}
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
        refetchFunction={refetchServices}
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
          // isFetchLoading={isFetchLoading}
          services={servicesData}
          branchesList={branchesList}
        />
      </div>
    </div>
  );
};
export default Services;
