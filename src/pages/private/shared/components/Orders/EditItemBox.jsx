import Dropdown from "@/components/Dropdown";
import useAppContext from "@/hooks/useAppContext";
import { Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const EditItemBox = ({ item, onUpdateItem, onDeleteItem }) => {
  const { services, items } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
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
          onClick={onDeleteItem}
        />
      </div>

      <div className="mb-5">
        <p className="block text-sm">Item</p>
        <div className="text-dark cursor-pointer relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between border-2 border-gray-300 rounded-md px-4 py-2 w-full text-sm"
          >
            {item?.serviceItem
              ? getItemName(item?.serviceItem?._id)
              : "-- item --"}
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
              {itemsList?.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer w-[10rem]"
                  onClick={() => {
                    onUpdateItem(item.id, { serviceItem: option });
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

      <Dropdown
        options={servicesList}
        item={getServiceName(item?.service)}
        setItem={(selectedService) =>
          onUpdateItem(item.id, { service: selectedService })
        }
        label="Service"
      />

      <p className="text-[14px] mt-5 mb-3">Quantity</p>
      <div className="flex items-center space-x-2">
        <p
          className="w-6 h-6 rounded-full border-2 border-black font-semibold flex items-center justify-center cursor-pointer"
          onClick={() =>
            onUpdateItem(item.id, { quantity: Math.max(0, item.quantity - 1) })
          }
        >
          -
        </p>
        <div>{item?.quantity}</div>
        <p
          className="w-6 h-6 rounded-full border-2 border-black font-semibold flex items-center justify-center cursor-pointer"
          onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
        >
          +
        </p>
      </div>

      <div className="flex items-center space-x-1 mt-5">
        <input
          type="checkbox"
          checked={item?.isIroned}
          className="w-5 h-5"
          onChange={() => onUpdateItem(item.id, { isIroned: !item.isIroned })}
        />
        <p>Iron</p>
      </div>
    </div>
  );
};

EditItemBox.propTypes = {
  item: PropTypes.object.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default EditItemBox;
