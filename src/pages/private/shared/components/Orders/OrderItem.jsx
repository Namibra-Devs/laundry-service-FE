import PropTypes from "prop-types";
import { useState } from "react";
import { iconDictionary } from "../../../../../lib/data/IconsDictionary";
import { Ellipsis } from "lucide-react";
import useAppContext from "../../../../../hooks/useAppContext";

const OptionsDropDown = ({ isOpen, setIsOpen, state, order }) => {
  const { viewItem, editItem, setCurrentItemId } = useAppContext();

  const onViewClick = (id) => {
    viewItem("Order");
    setCurrentItemId(id);
  };

  //   const onEditClick = (id) => {
  //     editItem("Order");
  //     setCurrentItemId(id);
  //   };

  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          role="menu"
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => onViewClick(order?.id)}
          >
            View
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => alert(state)}
          >
            To{" "}
            {state === "pending"
              ? "In Progress"
              : state === "in_progress"
              ? "Completed"
              : state === "completed"
              ? "Delivered"
              : "Pending"}
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

OptionsDropDown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
};

const OrderItem = ({ order, state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const stateColors = {
    pending: {
      color: "hover:border-blue-500",
    },
    in_progress: {
      color: "hover:border-custom_yellow_dark",
    },
    completed: {
      color: "hover:border-custom_green",
    },
    delivered: {
      color: "hover:border-gray-400",
    },
  };

  const { color } = stateColors[state] || "";

  return (
    <div
      className={`bg-white p-3 rounded-[10px] my-2 border-2 border-transparent ${color} transition-all duration-300 cursor-default relative`}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <small>{order?.customerName}</small>
        <Ellipsis
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />

        <div className="absolute top-2 right-0">
          <OptionsDropDown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            state={state}
            order={order}
          />
        </div>
      </div>
      {/* body */}
      <div className="flex items-center justify-between text-gray-400 my-1">
        <small>{order?.customerPhoneNumber}</small>
        <small>WR</small>
      </div>
      <div className="flex items-center justify-between text-gray-400 my-1">
        <small>{order?.customerEmail}</small>
        {/* <small>WR</small> */}
      </div>
      <div className="my-2 flex items-center">
        {order?.items?.map((item, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full bg-ash_light flex items-center justify-center"
          >
            <img src={iconDictionary[item]} alt={item} width={25} />
          </div>
        ))}
      </div>
      {/* bottom */}
      <div className="py-1 px-2 bg-ash_light rounded-[10px]">
        <div className="flex items-center justify-between">
          <small className="text-gray-500">Time</small>
          <small className="font-semibold text-gray-700">{order?.time}</small>
        </div>
        <div className="flex items-center justify-between mt-2">
          <small className="text-gray-500">Day</small>
          <small className="font-semibold text-gray-700">{order?.day}</small>
        </div>
        <div className="flex items-center justify-between mt-2">
          <small className="text-gray-500">Quantity</small>
          <small className="font-semibold text-gray-700">
            {order?.quantity}
          </small>
        </div>
        <div className="flex items-center justify-between mt-2">
          <small className="text-gray-500">Price</small>
          <small className="font-semibold text-gray-700">
            GHC {order?.price}
          </small>
        </div>
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
};

export default OrderItem;
