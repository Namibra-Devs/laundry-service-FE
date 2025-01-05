import CustomButton from "../../../../../components/CustomButton";
import PropTypes from "prop-types";
import Input from "../../../../../components/Input";
import { Check } from "lucide-react";

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
      <hr className="w-[5rem] h-[3px] bg-custom_yellow_dark" />
      <div className="flex flex-col items-center text-custom_yellow_dark">
        <span className="w-8 h-8 rounded-full bg-custom_yellow_dark text-white flex items-center justify-center">
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

const StepTwo = ({ onClose, onNext, onBack }) => {
  const handleNext = () => {
    onNext();
  };

  return (
    <>
      <FlowTag />
      <form className="p-4">
        <Input
          label="Two"
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

        <div className="flex items-center gap-4">
          <CustomButton label="Back" variant="outlined" onClick={onBack} />
          <CustomButton label="Next" variant="contained" onClick={handleNext} />
        </div>
      </div>
    </>
  );
};

StepTwo.propTypes = {
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default StepTwo;
