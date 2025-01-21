import Dropdown from "../../../../../components/Dropdown";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import useAppContext from "@/hooks/useAppContext";
import { useOrderForm } from "@/lib/store/PageForms";

const ItemBox = ({ item }) => {
  const {
    deleteItem,
    setItemService,
    setServiceItem,
    updateIronState,
    decreaseItemQuantity,
    increaseItemQuantity,
  } = useOrderForm();

  const { services, items } = useAppContext();
  const servicesList = [...new Set(services?.map((service) => service))];
  const itemsList = [...new Set(items?.map((item) => item))];

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service?.name || serviceId;
  };

  const getItemName = (itemId) => {
    const item = items.find((i) => i._id === itemId);
    return item?.name || itemId;
  };

  return (
    <div className="bg-ash_light p-5 rounded-[10px] mt-5">
      <div className="flex justify-end mb-3">
        <Trash2
          className="cursor-pointer active:scale-105"
          onClick={() => deleteItem(item?.id)}
        />
      </div>

      <Dropdown
        options={itemsList}
        item={getItemName(item?.serviceItem)}
        setItem={(selectedItem) => setServiceItem(item?.id, selectedItem)}
        label="Item Name"
      />

      <Dropdown
        options={servicesList}
        item={getServiceName(item?.service)}
        setItem={(selectedService) => setItemService(item?.id, selectedService)}
        label="Service"
      />

      <p className="text-[14px] mt-5 mb-3">Quantity</p>
      <div className="flex items-center space-x-2">
        <p
          className="w-6 h-6 rounded-full border-2 border-black font-semibold flex items-center justify-center cursor-pointer"
          onClick={() => decreaseItemQuantity(item?.id)}
        >
          -
        </p>
        <div>{item?.quantity}</div>
        <p
          className="w-6 h-6 rounded-full border-2 border-black font-semibold flex items-center justify-center cursor-pointer"
          onClick={() => increaseItemQuantity(item?.id)}
        >
          +
        </p>
      </div>

      <div className="flex items-center space-x-1 mt-5">
        <input
          type="checkbox"
          checked={item?.isIroned}
          className="w-5 h-5"
          onChange={() => updateIronState(item?.id)}
        />
        <p>Iron</p>
      </div>
    </div>
  );
};

ItemBox.propTypes = {
  item: PropTypes.object,
};

export default ItemBox;
