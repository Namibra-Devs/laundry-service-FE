import { Plus } from "lucide-react";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import CustomButton from "../../../../components/CustomButton";
import useAppContext from "../../../../hooks/useAppContext";

const Customers = () => {
  const { isModalOpen, currentForm, openModal, closeModal } = useAppContext();
  return (
    <>
      <CreateItemModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        section={currentForm || ""}
        onSubmit={() => console.log(`submitting ${currentForm} form`)}
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
