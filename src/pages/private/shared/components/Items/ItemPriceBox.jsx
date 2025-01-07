import Dropdown from "../../../../../components/Dropdown";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useItemsForm } from "../../../../../lib/store/PageForms";

const ItemPriceBox = ({ priceItem }) => {
  const branches = ["Branch 1", "Branch 2", "Branch 3", "Branch 4"];
  const currencies = ["GH¢", "USD"];

  const {
    deletePrice,
    setWashPrice,
    setIronPrice,
    setItemBranch,
    setWashCurrency,
    setIronCurrency,
  } = useItemsForm((state) => state);

  return (
    <div className="bg-ash_light p-5 rounded-[10px] mt-5">
      <div
        className="flex justify-end mb-3"
        onClick={() => deletePrice(priceItem?.id)}
      >
        <Trash2 className="cursor-pointer active:scale-105" />
      </div>
      <Dropdown
        options={branches}
        item={priceItem?.branch || ""}
        setItem={(selectedBranch) =>
          setItemBranch(priceItem?.id, selectedBranch)
        }
        label="Branch"
      />

      <div className="mt-5">
        <p className="text-sm mb-1">Wash Price</p>
        <div className="flex items-center space-x-3">
          <div className="w-28">
            <Dropdown
              options={currencies}
              item={priceItem?.washCurrency || "GHC"}
              setItem={(selectedCurrency) =>
                setWashCurrency(priceItem?.id, selectedCurrency)
              }
            />
          </div>
          <input
            type="number"
            value={priceItem?.washPrice}
            onChange={(e) => setWashPrice(priceItem?.id, e.target.value)}
            className="block w-full p-2 border-2 rounded-md border-gray-300 focus:ring-red-500 text-dark"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm mb-1">Iron Price</p>
        <div className="flex items-center space-x-3">
          <div className="w-28">
            <Dropdown
              options={currencies}
              item={priceItem?.ironCurrency || ""}
              setItem={(selectedCurrency) =>
                setIronCurrency(priceItem?.id, selectedCurrency)
              }
            />
          </div>
          <input
            type="number"
            value={priceItem?.ironPrice}
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
