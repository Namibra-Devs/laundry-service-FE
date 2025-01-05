import { X } from "lucide-react";
import CustomButton from "../../../../components/CustomButton";
import { useState } from "react";
import PropTypes from "prop-types";

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

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col">
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
          {currentStep === 1 && "step one"}
          {currentStep === 2 && "step two"}
          {currentStep === 3 && "step three"}
        </section>

        {/* Footer */}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p onClick={onClose} className="cursor-pointer">
            Cancel
          </p>
          <div className="flex items-center gap-4 w-fit">
            {currentStep !== 1 && (
              <CustomButton
                label="Back"
                variant="outlined"
                onClick={handleBack}
              />
            )}

            {currentStep !== 3 ? (
              <CustomButton
                label="Next"
                variant="contained"
                onClick={handleNext}
              />
            ) : (
              <CustomButton
                label="Submit"
                variant="contained"
                onClick={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CreateOrderModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateOrderModal;
