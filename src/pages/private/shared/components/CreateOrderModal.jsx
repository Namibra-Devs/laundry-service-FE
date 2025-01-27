import { X } from "lucide-react";
import PropTypes from "prop-types";
import StepOne from "./Orders/StepOne";
import StepTwo from "./Orders/StepTwo";
import StepThree from "./Orders/StepThree";
import { useOrderForm } from "@/lib/store/PageForms";
import ReactDOM from "react-dom";

const CreateOrderModal = ({
  isModalOpen,
  onClose,
  message,
  messageType,
  loading,
  createOrder,
  currentStep,
  setCurrentStep,
}) => {
  const { data } = useOrderForm();

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (!isModalOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h4 className="text-base text-gray-500">Add Order</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <section className="flex-1 overflow-y-auto px-6 py-4">
          {currentStep === 1 ? (
            <StepOne onClose={onClose} onNext={handleNext} initialData={data} />
          ) : currentStep === 2 ? (
            <StepTwo
              onClose={onClose}
              initialData={data}
              onNext={handleNext}
              onBack={handleBack}
            />
          ) : (
            <StepThree
              onClose={onClose}
              initialData={data}
              onBack={handleBack}
              onSubmit={createOrder}
              message={message}
              messageType={messageType}
              loading={loading}
            />
          )}
        </section>
      </div>
    </div>,
    document.getElementById("modal")
  );
};

CreateOrderModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  messageType: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  createOrder: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default CreateOrderModal;
