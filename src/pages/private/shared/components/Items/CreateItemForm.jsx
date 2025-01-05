import Input from "../../../../../components/Input";
import ItemPriceBox from "./ItemPriceBox";

const CreateItemForm = () => {
  return (
    <>
      <div className="sm:px-10">
        <Input
          label="Item Name"
          name="itemName"
          id="itemName"
          value=""
          onChange={() => {}}
          type="text"
        />
      </div>

      <div>
        <ItemPriceBox />
      </div>
    </>
  );
};
export default CreateItemForm;
