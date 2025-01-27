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

  const { services } = useAppContext();

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service?.name || serviceId;
  };

  const getServicePrices = (item, branchId) => {
    const matchingPrices = item?.orderItem?.pricing?.filter(
      (price) => price?.branch?._id === branchId
    );

    const pricesWithServices = {};

    matchingPrices?.forEach((price) => {
      const itemName = getServiceName(item?.orderItem?.name);

      pricesWithServices[itemName] = {
        Washing: price?.washingPrice,
        Ironing: price?.ironingPrice,
      };
    });

    return pricesWithServices;
  };

  let totalCost;

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
          {data?.servicesRendered?.map((item, index) => {
            const branchId = data?.branch;
            const service = getServiceName(item?.service);
            const itemName = item?.orderItem?.name;
            const allPrices = getServicePrices(item, branchId);

            let costForItem;

            const getCost = () => {
              if (allPrices[itemName] && allPrices[itemName][service]) {
                costForItem = item?.quantity * allPrices[itemName][service];
                totalCost += costForItem;
              }
              return costForItem;
            };

            getCost();

            return (
              <div key={index} className="flex flex-col space-y-2 mb-5">
                <span>{itemName}</span>
                <div className="bg-gray-100 p-5 rounded-md">
                  <div className="flex items-center justify-between">
                    <h1>Quantity</h1>
                    <p>{item?.quantity}</p>
                  </div>
                  <div className="flex items-center justify-between w-full mt-5">
                    <h1>{service}</h1>
                    <p>
                      GHC{" "}
                      {allPrices[itemName] && allPrices[itemName][service]
                        ? allPrices[itemName][service]
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
          <h2>Total Cost: {totalCost}</h2>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 px-6 py-4 border-t border-gray-200 flex items-center justify-between w-full bg-white">
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
