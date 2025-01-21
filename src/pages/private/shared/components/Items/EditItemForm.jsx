import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect } from "react";
import { useState } from "react";
// import ItemPriceBox from "./ItemPriceBox";
import CustomButton from "@/components/CustomButton";
import { useItemsForm } from "@/lib/store/PageForms";

const EditItemForm = () => {
  const { currentItem: item } = useAppContext();
  const [itemName, setItemName] = useState("");
  const [pricing, setPricing] = useState([]);

  const { updateWashPrice } = useItemsForm((state) => state);

  useEffect(() => {
    setItemName(item?.name || "");
    setPricing(item?.pricing || []);
  }, [item]);

  const updateItem = (e) => {
    e.preventDefault();
    console.log(itemName, pricing);
  };

  // return <div>Edit Item: {item?.id}</div>;
  return (
    <>
      <form onSubmit={updateItem}>
        <Input
          label="Item Name"
          name="itemName"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          type="text"
        />

        <div>
          {item?.pricing?.map((priceItem, index) => (
            // <ItemPriceBox key={priceItem?._id} priceItem={priceItem} />
            // <p key={priceItem?.id}>Washing Price: {priceItem?.washingPrice}</p>
            <div key={priceItem?._id}>
              <p>WashPrice for {index}</p>
              <input
                type="text"
                value={priceItem?.washingPrice}
                onChange={(e) => updateWashPrice(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <CustomButton
            type="submit"
            label="Update Staff"
            variant="contained"
          />
        </div>
      </form>
    </>
  );
};

export default EditItemForm;
