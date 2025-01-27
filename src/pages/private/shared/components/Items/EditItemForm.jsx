import Input from "@/components/Input";
import useAppContext from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Plus } from "lucide-react";
import EditItemBox from "./EditItemBox";
import useAuth from "@/hooks/useAuth";
import { updateData } from "@/lib/utils/updateData";

const EditItemForm = () => {
  const { currentItem: item, triggerUpdate } = useAppContext();
  const [itemName, setItemName] = useState("");
  const [pricing, setPricing] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
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
    setMessage("");
    setLoading(true);

    const updatedItem = {
      name: itemName,
      pricing,
    };

    if (!itemName) {
      setMessage("Item name is required");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (itemName.length < 3) {
      setMessage("Item name must be at least 3 characters long");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (updatedItem?.pricing.length === 0) {
      setMessage("Add at least one price");
      setMessageType("error");
      setLoading(false);
      return;
    }

    for (const priceItem of updatedItem.pricing) {
      if (!priceItem.branch) {
        setMessage("Branch name is required for all price entries");
        setMessageType("error");
        setLoading(false);
        return;
      }
      if (!priceItem.washingPrice) {
        setMessage("Please set the washing price for all price entries");
        setMessageType("error");
        setLoading(false);
        return;
      }
      if (Number(priceItem.washingPrice) === 0) {
        setMessage(
          "Washing price must be greater than 0 for all price entries"
        );
        setMessageType("error");
        setLoading(false);
        return;
      }
      if (!priceItem.ironingPrice) {
        setMessage("Please set the ironing price for all price entries");
        setMessageType("error");
        setLoading(false);
        return;
      }
      if (Number(priceItem.ironingPrice) === 0) {
        setMessage(
          "Ironing price must be greater than 0 for all price entries"
        );
        setMessageType("error");
        setLoading(false);
        return;
      }
    }

    try {
      // console.log("Updated Item:", updatedItem);
      const { data, message } = await updateData(
        "item",
        item?._id,
        updatedItem,
        accessToken
      );

      if (message) {
        setMessageType(message?.type);
        setMessage(message?.text);
      }

      if (data) {
        triggerUpdate("item");
      }
    } catch (error) {
      console.error("Unexpected error during item update:", error);
      setMessageType("error");
      setMessage(error);
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
      {message && (
        <p
          className={`${
            messageType === "success" ? "bg-success" : "bg-danger"
          } text-white px-5 py-3 rounded-md text-center w-[90%] mx-auto mt-2`}
        >
          {message}
        </p>
      )}

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
