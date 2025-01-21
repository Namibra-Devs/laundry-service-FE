import CustomButton from "../../../../../components/CustomButton";
import PropTypes from "prop-types";
import { Check } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";
// import { useOrdersItems } from "@/lib/store/PageForms";
import ItemBox from "./ItemBox";
import Dropdown from "@/components/Dropdown";
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
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { branches } = useAppContext();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <>
      <FlowTag />
      {message && (
        <p
          className={`${
            messageType === "success" ? "bg-success" : "bg-danger"
          } text-white px-5 py-3 rounded-md text-center w-[90%] mx-auto mt-2`}
        >
          {message}
        </p>
      )}
      <div className="sm:px-10 mt-3 mb-20">
        <Dropdown
          options={branchesList}
          item={getBranchName(branch)}
          setItem={setBranch}
          label="Branch"
        />

        <div className="flex items-center justify-end my-5">
          <span
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => {
              if (!branch) {
                setMessage("Branch is required");
                setMessageType("error");
                return;
              } else setMessage("");
              // addNewItem(items.length + 1);
            }}
          >
            <Plus size={20} />
            <p className="text-[12px]">Add New Item</p>
          </span>
        </div>

        {/* <div>
          {items?.map((item, index) => (
            <ItemBox key={index} item={item} />
          ))}
        </div> */}
      </div>
      <div className="absolute bottom-0 left-0 px-6 py-4 border-t border-gray-200 flex items-center justify-between w-full bg-white">
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
  initialData: PropTypes.object.isRequired,
};

export default StepTwo;
