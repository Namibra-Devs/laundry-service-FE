import { Plus } from "lucide-react";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import { useCustomerForm } from "../../../../lib/store/PageForms";
import ViewItemModal from "@/components/common/ViewItemModal";
import DeleteAlert from "@/components/common/DeleteAlert";
import { CustomersTable } from "../components/customers/CustomersTable";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { createData } from "@/lib/utils/createData";

const Customers = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    auth: { accessToken },
  } = useAuth();

  const { customers, triggerUpdate } = useAppContext();

  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    if (Array.isArray(customers)) {
      const reversed = [...customers].reverse();
      setCustomersData(reversed);
    }
  }, [customers]);

  const {
    editItem,
    viewItem,
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

  const {
    clearCustomerForm,
    firstName,
    middleName,
    surName,
    email,
    phoneNumber,
    houseNumber,
    branch,
  } = useCustomerForm((state) => state);

  const onViewClick = (customerItem) => {
    viewItem("Customer");
    setCurrentItem(customerItem);
  };

  const onEditClick = (customerItem) => {
    editItem("Customer");
    setCurrentItem(customerItem);
  };

  const onDeleteClick = (id) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const createCustomer = async () => {
    setLoading(true);
    setMessage("");

    if (!firstName || !surName || !email || !phoneNumber || !houseNumber) {
      setMessage("All fields are required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!branch) {
      setMessageType("error");
      setMessage("Branch is required.");
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Invalid email address");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("Phone number must be 10 digits");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const customerObject = {
      firstName,
      middleName,
      lastName: surName,
      email,
      phone: phoneNumber,
      houseNumber,
      branch,
    };

    try {
      const { data, message } = await createData(
        "customer",
        customerObject,
        accessToken
      );

      if (message) {
        setMessage(message.text);
        setMessageType(message.type);
      }

      if (data) {
        console.log("Customer created successfully:", data);
        clearCustomerForm();
        triggerUpdate("customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      setMessage(message?.text);
      setMessageType(message?.type);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    closeModal();
    clearCustomerForm();
    setMessage("");
  };

  return (
    <>
      <DeleteAlert
        page="customer"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createCustomer}
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
            Shop <span className="text-custom_yellow_dark">~ Customers</span>
          </p>
        </div>

        <CustomButton
          label="Add Customer"
          icon={<Plus />}
          variant="contained"
          onClick={() => openModal("Customer")}
        />
      </div>

      <div className="w-screen sm:w-full overflow-auto">
        <CustomersTable
          onViewClick={onViewClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          customers={customersData}
        />
      </div>
    </>
  );
};
export default Customers;
