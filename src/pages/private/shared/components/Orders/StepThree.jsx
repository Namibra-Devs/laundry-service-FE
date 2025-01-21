import CustomButton from "../../../../../components/CustomButton";
import PropTypes from "prop-types";
import { Check } from "lucide-react";
import { useOrderForm } from "@/lib/store/PageForms";
import useAppContext from "@/hooks/useAppContext";

const FlowTag = () => {
  return (
    <div className="flex items-center justify-between w-[80%] mx-auto">
      <div className="flex flex-col items-center text-success">
        <span className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center">
          <Check />
        </span>
        <small>Personal Information</small>
      </div>
      {/* <span className="flex-grow border-t mx-2"></span> */}
      <hr className="w-[5rem] h-[3px] bg-success" />
      <div className="flex flex-col items-center text-success">
        <span className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center">
          <Check />
        </span>
        <small>Item Information</small>
      </div>
      <hr className="w-[5rem] h-[3px] bg-custom_yellow_dark" />
      <div className="flex flex-col items-center text-custom_yellow_dark">
        <span className="w-8 h-8 rounded-full bg-custom_yellow_dark text-white flex items-center justify-center">
          3
        </span>
        <small>Bill Information</small>
      </div>
    </div>
  );
};

const StepThree = ({
  onBack,
  onSubmit,
  onClose,
  messageType,
  message,
  loading,
}) => {
  const { data } = useOrderForm();

  const { services, items } = useAppContext();

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service?.name || serviceId;
  };

  const getItemName = (itemId) => {
    const item = items.find((i) => i._id === itemId);
    return item?.name || itemId;
  };

  return (
    <>
      <FlowTag />
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-4">
        {message && (
          <p
            className={`${
              messageType === "success" ? "bg-success" : "bg-danger"
            } text-white px-5 py-3 rounded-md text-center w-[90%] mx-auto mt-2`}
          >
            {message}
          </p>
        )}

        <div>
          {data?.servicesRendered?.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <span>{getItemName(item?.serviceItem)}</span>
              <div className="bg-gray-100 p-5 rounded-md">
                <div className="flex items-center justify-between">
                  <h1>Quantity</h1>
                  <p>{item?.quantity}</p>
                </div>
                <div className="flex items-center justify-between my-5">
                  <h1>{getServiceName(item?.service)}</h1>
                  <p>{item?.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 px-6 py-4 border-t border-gray-200 flex items-center justify-between w-full">
        <p onClick={onClose} className="cursor-pointer">
          Cancel
        </p>

        <div className="flex items-center gap-4">
          <CustomButton label="Back" variant="outlined" onClick={onBack} />
          <CustomButton label="Submit" variant="contained" onClick={onSubmit} />
        </div>
      </div>
    </>
  );
};

StepThree.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  messageType: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default StepThree;
