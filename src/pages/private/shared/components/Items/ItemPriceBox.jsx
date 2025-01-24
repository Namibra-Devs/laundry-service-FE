import Dropdown from "../../../../../components/Dropdown";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useItemsForm } from "../../../../../lib/store/PageForms";
import useAppContext from "@/hooks/useAppContext";

const ItemPriceBox = ({ priceItem }) => {
  const { branches } = useAppContext();

  const branchesList = [...new Set(branches?.map((branch) => branch))];

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch?.name || branchId;
  };

  const { deletePrice, setWashPrice, setIronPrice, setItemBranch } =
    useItemsForm((state) => state);

  return (
    <div className="bg-ash_light p-5 rounded-[10px] mt-5">
      <div className="flex justify-end mb-3">
        <Trash2
          className="cursor-pointer active:scale-105"
          onClick={() => deletePrice(priceItem?.id)}
        />
      </div>
      <Dropdown
        options={branchesList}
        item={getBranchName(priceItem?.branch)}
        setItem={(selectedBranch) =>
          setItemBranch(priceItem?.id, selectedBranch)
        }
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
            onChange={(e) => setWashPrice(priceItem?.id, e.target.value)}
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
            onChange={(e) => setIronPrice(priceItem?.id, e.target.value)}
            className="block w-full p-2 border-2 rounded-md border-gray-300 focus:ring-red-500 text-dark"
          />
        </div>
      </div>
    </div>
  );
};

ItemPriceBox.propTypes = {
  priceItem: PropTypes.object,
};

export default ItemPriceBox;
