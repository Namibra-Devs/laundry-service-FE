import CustomButton from "../../../../../components/CustomButton";
import PropTypes from "prop-types";
import { Check } from "lucide-react";
import { Plus } from "lucide-react";
import ItemBox from "./ItemBox";
import Dropdown from "@/components/Dropdown";
import useAppContext from "@/hooks/useAppContext";
import { useOrderForm } from "@/lib/store/PageForms";

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
  const { data, setBranch, addOrderItem } = useOrderForm();
  const { branches, setAlert } = useAppContext();

  const branchesList = [
    ...new Map(
      branches
        ?.filter((branch) => branch?.status === "active")
        .map((branch) => [branch?._id, branch])
    ).values(),
  ];
  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  const handleNext = () => {
    if (!data?.branch) {
      setAlert((prev) => ({
        ...prev,
        message: "Branch is required.",
        type: "warning",
      }));
      return;
    }

    if (!data?.servicesRendered || data?.servicesRendered?.length === 0) {
      setAlert((prev) => ({
        ...prev,
        message: "Add at least one item",
        type: "warning",
      }));
      return;
    }

    const invalidItems = data?.servicesRendered?.filter(
      (item) =>
        !item?.orderItem ||
        !item?.quantity ||
        item?.quantity === 0 ||
        !item?.service
    );

    if (invalidItems.length > 0) {
      setAlert((prev) => ({
        ...prev,
        message: "Missing item identities",
        type: "warning",
      }));
      return;
    }

    onNext();
  };

  return (
    <>
      <FlowTag />

      <div className="sm:px-10 mt-3 mb-20">
        <Dropdown
          options={branchesList.length > 0 ? branchesList : [{}]}
          item={getBranchName(data?.branch)}
          setItem={setBranch}
          label="Branch"
        />

        <div className="flex items-center justify-end my-5">
          <span
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() => {
              if (!data?.branch) {
                setAlert((prev) => ({
                  ...prev,
                  message: "Branch is required.",
                  type: "warning",
                }));
                return;
              } else
                setAlert((prev) => ({
                  ...prev,
                  message: "",
                }));
              addOrderItem(new Date().getTime());
            }}
          >
            <Plus size={20} />
            <p className="text-[12px]">Add New Item</p>
          </span>
        </div>

        <div>
          {data?.servicesRendered?.map((item, index) => (
            <ItemBox key={index} item={item} />
          ))}
        </div>
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
