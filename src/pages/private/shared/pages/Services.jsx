import CustomButton from "../../../../components/CustomButton";
import CreateItemModal from "../../../../components/common/CreateItemModal";
import { Plus } from "lucide-react";
import useAppContext from "../../../../hooks/useAppContext";

const Services = () => {
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
    </>
  );
};
export default Services;
