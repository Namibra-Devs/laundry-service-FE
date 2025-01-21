import { X } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import StepOne from "./Orders/StepOne";
import StepTwo from "./Orders/StepTwo";
import StepThree from "./Orders/StepThree";
import { useOrderForm } from "@/lib/store/PageForms";
import useAppContext from "@/hooks/useAppContext";
import { createData } from "@/lib/utils/createData";
import useAuth from "@/hooks/useAuth";

const CreateOrderModal = ({ isModalOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data, resetAll } = useOrderForm();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const { triggerUpdate } = useAppContext();
  const {
    auth: { accessToken },
  } = useAuth();

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const createOrder = async () => {
    setLoading(true);
    setMessage("");

    let orderData = {};

    if (data?.customer) {
      orderData = {
        branch: data?.branch,
        customer: data?.customer,
        servicesRendered: data?.servicesRendered,
      };
    } else {
      orderData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        phone: data?.phone,
        houseNumber: data?.houseNumber,
        branch: data?.branch,
        servicesRendered: data?.servicesRendered,
      };
    }

    try {
      // console.log(orderData);
      const { data: responseData, message } = await createData(
        "order",
        orderData,
        accessToken
      );

      if (message) {
        setMessage(message.text);
        setMessageType(message.type);
      }

      if (responseData) {
        console.log("Order created successfully:", responseData);
        resetAll();
        triggerUpdate("order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setMessage(message?.text);
      setMessageType(message?.type);
    } finally {
      setLoading(false);
    }
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
    </div>
  );
};

CreateOrderModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateOrderModal;
