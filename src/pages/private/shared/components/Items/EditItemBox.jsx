import Dropdown from "@/components/Dropdown";
import useAppContext from "@/hooks/useAppContext";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const EditItemBox = ({
  priceItem,
  onBranchChange,
  onWashPriceChange,
  onIronPriceChange,
  onDelete,
}) => {
  const { branches } = useAppContext();
  const [itemBranch, setItemBranch] = useState();

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

  useEffect(() => {
    if (priceItem?.branch && typeof priceItem.branch === "object") {
      setItemBranch(priceItem.branch._id);
    } else {
      setItemBranch(priceItem?.branch);
    }
  }, [priceItem]);

  return (
    <div className="bg-ash_light p-5 rounded-[10px] mt-5">
      <div className="flex justify-end mb-3">
        <Trash2
          className="cursor-pointer active:scale-105"
          onClick={onDelete}
        />
      </div>

      <Dropdown
        options={branchesList.length > 0 ? branchesList : [{}]}
        item={getBranchName(itemBranch)}
        setItem={onBranchChange}
        label="Branch"
      />

      <div className="mt-5">
        <p className="text-sm mb-1">Wash Price</p>
        <div className="flex items-center space-x-3">
          <div className="w-28 border-2 border-gray-400 rounded-md text-center py-1">
            GH¢
          </div>
          <input
            type="number"
            value={priceItem?.washingPrice}
            onChange={(e) => onWashPriceChange(e.target.value)}
            className="block w-full p-2 border-2 rounded-md border-gray-300 focus:ring-red-500 text-dark"
          />
        </div>
      </div>
      <div className="mt-5">
        <p className="text-sm mb-1">Iron Price</p>
        <div className="flex items-center space-x-3">
          <div className="w-28 border-2 border-gray-400 rounded-md text-center py-1">
            GH¢
          </div>
          <input
            type="number"
            value={priceItem?.ironingPrice}
            onChange={(e) => onIronPriceChange(e.target.value)}
            className="block w-full p-2 border-2 rounded-md border-gray-300 focus:ring-red-500 text-dark"
          />
        </div>
      </div>
    </div>
  );
};

EditItemBox.propTypes = {
  priceItem: PropTypes.object.isRequired,
  onBranchChange: PropTypes.func.isRequired,
  onWashPriceChange: PropTypes.func.isRequired,
  onIronPriceChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EditItemBox;
