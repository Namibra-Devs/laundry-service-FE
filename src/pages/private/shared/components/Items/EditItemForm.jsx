import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect } from "react";
import { useState } from "react";
// import ItemPriceBox from "./ItemPriceBox";
import CustomButton from "@/components/CustomButton";

const EditItemForm = () => {
  const { currentItem: item } = useAppContext();
  const [itemName, setItemName] = useState("");
  const [pricing, setPricing] = useState([]);

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
          {item?.pricing?.map((priceItem) => (
            // <ItemPriceBox key={priceItem?._id} priceItem={priceItem} />
            <p key={priceItem?.id}>Washing Price: {priceItem?.washingPrice}</p>
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
