import { X } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import StepOne from "./Orders/StepOne";
import StepTwo from "./Orders/StepTwo";
import StepThree from "./Orders/StepThree";

const CreateOrderModal = ({ isModalOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  //   const [formData, setFormData] = useState({});

  const handleNext = () => {
    //  setFormData({ ...formData, ...data });
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    alert("submitting order details");
  };

  if (!isModalOpen) return null;

  return (
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
        <section className="flex-1 overflow-y-auto px-6 py-4 view_screen">
          {currentStep === 1 ? (
            <StepOne onClose={onClose} onNext={handleNext} />
          ) : currentStep === 2 ? (
            <StepTwo
              onClose={onClose}
              onNext={handleNext}
              onBack={handleBack}
            />
          ) : (
            <StepThree
              onClose={onClose}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </section>
      </div>
    </div>
  );
};

CreateOrderModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateOrderModal;
