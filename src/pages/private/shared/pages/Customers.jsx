import { Plus } from "lucide-react";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";
import { useCustomerForm } from "../../../../lib/store/PageForms";

const Customers = () => {
  const { isModalOpen, currentForm, openModal, closeModal } = useAppContext();

  const customer = useCustomerForm((state) => state);

  const createCustomer = () => {
    console.log("Customer:", {
      firstName: customer?.firstName,
      middleName: customer?.middleName,
      surname: customer?.surName,
      email: customer?.email,
      phoneNumber: customer?.phoneNumber,
      houseNumber: customer?.houseNumber,
      branch: customer?.branch,
    });
  };

  const onClose = () => {
    closeModal();
    customer?.clearCustomerForm();
  };

  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={onClose}
        section={currentForm || ""}
        onSubmit={createCustomer}
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
    </>
  );
};
export default Customers;
