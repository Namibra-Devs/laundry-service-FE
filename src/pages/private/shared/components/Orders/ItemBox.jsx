import Dropdown from "../../../../../components/Dropdown";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import useAppContext from "@/hooks/useAppContext";
import { useOrderForm } from "@/lib/store/PageForms";
import { useState } from "react";

const ItemBox = ({ item }) => {
  const {
    deleteItem,
    setItemService,
    setOrderItem,
    updateIronState,
    decreaseItemQuantity,
    increaseItemQuantity,
  } = useOrderForm();

  const { services, items } = useAppContext();
  const servicesList = Array.from(
    new Map(services?.map((service) => [service._id, service])).values()
  );
  const itemsList = Array.from(
    new Map(items?.map((item) => [item._id, item])).values()
  );

  const [isOpen, setIsOpen] = useState(false);

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service?.name || serviceId;
  };

  // const getItemName = (itemId) => {
  //   const item = items.find((i) => i._id === itemId);
  //   return item?.name || itemId;
  // };

  return (
    <div className="bg-ash_light p-5 rounded-[10px] mt-5">
      <div className="flex justify-end mb-3">
        <Trash2
          className="cursor-pointer active:scale-105"
          onClick={() => deleteItem(item?.id)}
        />
      </div>

      {/*  */}
      <div>
        <label className="text-sm mb-1">Item</label>
        <div className="relative text-dark cursor-pointer">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between border-2 border-gray-300 rounded-md px-4 py-2 w-full text-sm"
          >
            {item?.orderItem?.name ?? "-- select --"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isOpen && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-fit">
              {[{}, ...itemsList]?.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer w-[10rem]"
                  onClick={() => {
                    setOrderItem(item?.id, option);
                    setIsOpen(false);
                  }}
                >
                  {option?.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/*  */}

      {/* <Dropdown
        options={itemsList}
        item={getItemName(item?.serviceItem)}
        setItem={(selectedItem) => setServiceItem(item?.id, selectedItem)}
        label="Item Name"
      /> */}

      <Dropdown
        options={servicesList.length > 0 ? servicesList : [{}]}
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
