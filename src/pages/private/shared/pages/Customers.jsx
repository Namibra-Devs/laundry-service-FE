import { Plus } from "lucide-react";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import { useCustomerForm } from "../../../../lib/store/PageForms";
import ViewItemModal from "@/components/common/ViewItemModal";
import { CustomersTable } from "../components/customers/CustomersTable";
import DeleteAlert from "@/components/common/DeleteAlert";
import useAuth from "@/hooks/useAuth";
import axios from "@/api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { createData } from "@/lib/utils/createData";

const Customers = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const {
    auth: { accessToken, user },
  } = useAuth();

  const { customers } = useAppContext();
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
    if (Array.isArray(customers)) {
      const reversedBranches = [...customers].reverse();
      setCustomersData(reversedBranches);
    }
  }, [customers]);

  const {
    viewItem,
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

  const refetchCustomers = async () => {
    try {
      console.log("Refetching customers...");
      const response = await axios.get(`/api/customers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedData = response?.data?.data;
      setCustomersData([...fetchedData].reverse());
      console.log("Fetched Data:", fetchedData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

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
    setMessage("");
    setLoading(true);

    if (
      !firstName ||
      !middleName ||
      !surName ||
      !email ||
      !phoneNumber ||
      !houseNumber ||
      !branch
    ) {
      setMessageType("error");
      setMessage("All fields are required");
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

      if (message?.type === "success") {
        console.log("Success:", data);
        await refetchCustomers();
        setMessageType("success");
        setMessage(message?.text);
        clearCustomerForm();
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
    clearCustomerForm();
  };

  return (
    <>
      <DeleteAlert
        page="Customer"
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        itemId={selectedId}
        refetchFunction={refetchCustomers}
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createCustomer}
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
        refetchFunction={refetchCustomers}
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

      <CustomersTable
        onViewClick={onViewClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        customers={customersData}
      />
    </>
  );
};
export default Customers;
