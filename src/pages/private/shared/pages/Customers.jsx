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

const Customers = () => {
  const [selectedId, setSelectedId] = useState(null);

  const { customers } = useAppContext();

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
    const customerObject = {
      firstName,
      middleName,
      lastName: surName,
      email,
      phone: phoneNumber,
      houseNumber,
      branch,
    };

    console.log(customerObject);
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
      />

      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createCustomer}
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
