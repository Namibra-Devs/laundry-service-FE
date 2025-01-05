import CustomButton from "../../../../../components/CustomButton";
import Input from "../../../../../components/Input";
import PropTypes from "prop-types";

const FlowTag = () => {
  return (
    <div className="flex items-center justify-between w-[80%] mx-auto">
      <div className="flex flex-col items-center text-custom_yellow_dark">
        <span className="w-8 h-8 rounded-full bg-custom_yellow_dark text-white flex items-center justify-center">
          1
        </span>
        <small>Personal Information</small>
      </div>
      {/* <span className="flex-grow border-t mx-2"></span> */}
      <hr className="w-[5rem] h-[3px] bg-gray-200" />
      <div className="flex flex-col items-center text-gray-400">
        <span className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
          2
        </span>
        <small>Item Information</small>
      </div>
      <hr className="w-[5rem] h-[3px] bg-gray-200" />
      <div className="flex flex-col items-center text-gray-500">
        <span className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
          3
        </span>
        <small>Bill Information</small>
      </div>
    </div>
  );
};

const StepOne = ({ onClose, onNext }) => {
  const handleNext = () => {
    // if (!employeeID || !date || !truckName) {
    //   setMessageType("warning");
    //   setMessage("All fields are required.");
    //   return;
    // }
    // onNext({ employeeID, truckName, date });
    onNext();
  };

  return (
    <>
      <FlowTag />

      <form className="p-4">
        <Input
          label="One"
          name="itemName"
          id="itemName"
          value=""
          onChange={() => {}}
          type="text"
        />
      </form>
      <div className="absolute bottom-0 left-0 px-6 py-4 border-t border-gray-200 flex items-center justify-between w-full">
        <p onClick={onClose} className="cursor-pointer">
          Cancel
        </p>

        <CustomButton label="Next" variant="contained" onClick={handleNext} />
      </div>
    </>
  );
};

StepOne.propTypes = {
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default StepOne;
