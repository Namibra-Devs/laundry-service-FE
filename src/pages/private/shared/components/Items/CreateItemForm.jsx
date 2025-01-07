import { Plus } from "lucide-react";
import Input from "../../../../../components/Input";
import ItemPriceBox from "./ItemPriceBox";
import { useItemsForm } from "../../../../../lib/store/PageForms";

const CreateItemForm = () => {
  const { itemName, setItemName, prices, addNewPrice } = useItemsForm(
    (state) => state
  );

  return (
    <div className="sm:px-10">
      <div>
        <Input
          label="Item Name"
          name="itemName"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          type="text"
        />
      </div>

      <div className="flex items-center justify-end my-5">
        <span
          className="flex items-center space-x-1 cursor-pointer"
          onClick={() => addNewPrice(prices.length + 1)}
        >
          <Plus size={20} />
          <p className="text-[12px]">Add New Price</p>
        </span>
      </div>

      <div>
        {prices?.map((priceItem) => (
          <ItemPriceBox key={priceItem?.id} priceItem={priceItem} />
        ))}
      </div>
    </div>
  );
};
export default CreateItemForm;
