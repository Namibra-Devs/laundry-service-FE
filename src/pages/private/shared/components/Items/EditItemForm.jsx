import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Plus } from "lucide-react";
import EditItemBox from "./EditItemBox";
import useAuth from "@/hooks/useAuth";
import { updateData } from "@/lib/utils/updateData";

const EditItemForm = () => {
  const {
    currentItem: item,
    triggerUpdate,
    setAlert,
    closeViewModal,
  } = useAppContext();
  const [itemName, setItemName] = useState("");
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    auth: { accessToken },
  } = useAuth();

  useEffect(() => {
    if (item) {
      setItemName(item?.name || "");
      setPricing(item?.pricing || []);
    }
  }, [item]);

  const updateItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pricingList = pricing.map((item) => ({
      branch: item.branch?._id,
      ironingPrice: item.ironingPrice,
      washingPrice: item.washingPrice,
    }));

    const updatedItem = {
      name: itemName,
      pricing: pricingList,
    };

    if (!itemName) {
      setAlert((prev) => ({
        ...prev,
        message: "Item Name is required.",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (itemName.length < 3) {
      setAlert((prev) => ({
        ...prev,
        message: "Name must have at least 3 characters",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    if (updatedItem?.pricing.length === 0) {
      setAlert((prev) => ({
        ...prev,
        message: "Add at least one price",
        type: "warning",
      }));
      setLoading(false);
      return;
    }

    for (const priceItem of updatedItem.pricing) {
      if (!priceItem.branch) {
        setAlert((prev) => ({
          ...prev,
          message: "Branch name is required",
          type: "warning",
        }));
        setLoading(false);
        return;
      }
      if (!priceItem.washingPrice || Number(priceItem.washingPrice) === 0) {
        setAlert((prev) => ({
          ...prev,
          message: "Washing Price required",
          type: "warning",
        }));
        setLoading(false);
        return;
      }

      if (!priceItem.ironingPrice || Number(priceItem.ironingPrice) === 0) {
        setAlert((prev) => ({
          ...prev,
          message: "Ironing Price required",
          type: "warning",
        }));
        setLoading(false);
        return;
      }
    }

    try {
      // console.log(updatedItem);
      const { data, message } = await updateData(
        "item",
        item?._id,
        updatedItem,
        accessToken
      );

      if (message) {
        setAlert((prev) => ({
          ...prev,
          message: message?.text,
          type: message?.type,
        }));
      }

      if (data) {
        console.log("Item updated successfully:", data);
        setAlert((prev) => ({
          ...prev,
          message: "Item updated",
          type: "success",
        }));
        closeViewModal();
        triggerUpdate("item");
      }
    } catch (error) {
      console.error("Unexpected error during item update:", error);
      setAlert((prev) => ({
        ...prev,
        message: "Couldn't update item",
        type: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, field, value) => {
    setPricing((prevPricing) =>
      prevPricing.map((price) =>
        price._id === id ? { ...price, [field]: value } : price
      )
    );
  };

  const addNewPrice = () => {
    const newId = pricing.length + 1;
    setPricing([
      ...pricing,
      {
        _id: newId,
        branch: "",
        washingPrice: 0,
        ironingPrice: 0,
      },
    ]);
  };

  const deletePrice = (id) => {
    setPricing((prevPricing) =>
      prevPricing.filter((price) => price?._id !== id)
    );
  };

  return (
    <>
      <form>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10 rounded-lg flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        <Input
          label="Item Name"
          name="itemName"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          type="text"
        />

        <div className="flex items-center justify-end my-5">
          <span
            className="flex items-center space-x-1 cursor-pointer"
            onClick={addNewPrice}
          >
            <Plus size={20} />
            <p className="text-[12px]">Add New Price</p>
          </span>
        </div>

        <div>
          {pricing?.map((priceItem) => (
            <EditItemBox
              key={priceItem?._id}
              priceItem={priceItem}
              onBranchChange={(value) =>
                handlePriceChange(priceItem?._id, "branch", value)
              }
              onWashPriceChange={(value) =>
                handlePriceChange(priceItem?._id, "washingPrice", value)
              }
              onIronPriceChange={(value) =>
                handlePriceChange(priceItem?._id, "ironingPrice", value)
              }
              onDelete={() => deletePrice(priceItem?._id)}
            />
          ))}
        </div>

        <div className="mt-10">
          <CustomButton
            type="submit"
            label="Update Item"
            variant="contained"
            onClick={updateItem}
          />
        </div>
      </form>
    </>
  );
};

export default EditItemForm;
