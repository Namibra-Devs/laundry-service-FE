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
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    auth: { accessToken },
  } = useAuth();

  const { customers, triggerUpdate, setAlert } = useAppContext();

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

  const onClose = () => {
    closeModal();
    clearCustomerForm();
  };

  const createCustomer = async () => {
    setLoading(true);

    if (!firstName || !surName || !email || !phoneNumber || !houseNumber) {
      setAlert((prev) => ({
        ...prev,
        message: "All fields are required",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (!branch) {
      setAlert((prev) => ({
        ...prev,
        message: "Branch is required.",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setAlert((prev) => ({
        ...prev,
        message: "Invalid email address",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setAlert((prev) => ({
        ...prev,
        message: "Phone number must be 10 digits",
        type: "warning",
      }));
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
        setAlert((prev) => ({
          ...prev,
          message: message?.text,
          type: message?.type,
        }));
      }

      if (data) {
        console.log("Customer created:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Customer Created",
          type: "success",
        }));
        onClose();
        clearCustomerForm();
        triggerUpdate("customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      setAlert((prev) => ({
        ...prev,
        message: "An error occurred",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
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
