import PropTypes from "prop-types";
import { useState } from "react";
import { iconDictionary } from "../../../../../lib/data/IconsDictionary";
import { Ellipsis } from "lucide-react";
import useAppContext from "../../../../../hooks/useAppContext";
import { useOrders } from "@/lib/store/OrdersStore";
import { formatDate } from "@/lib/utils/formatDate";
import { updateOrderState } from "@/lib/utils/updateOrderState";
import useAuth from "@/hooks/useAuth";

const OptionsDropDown = ({ isOpen, setIsOpen, state, order }) => {
  const { viewItem, setCurrentItem, triggerUpdate, setAlert } = useAppContext();

  const {
    auth: { accessToken },
  } = useAuth();

  const onViewClick = (item) => {
    viewItem("Order");
    setCurrentItem(item);
  };

  const toMappings = {
    pending: "onprogress",
    onprogress: "completed",
    completed: "delivered",
    delivered: "",
  };

  const handleUpdate = async () => {
    try {
      const { data, message } = await updateOrderState(
        accessToken,
        order?._id,
        toMappings[state]
      );

      if (message || data) {
        console.log("message:", message);
        console.log("updated", data);
        setAlert((prev) => ({
          ...prev,
          message: message.text,
          type: message.type,
        }));
        triggerUpdate("order");
      }
    } catch (error) {
      console.log(error);
      setAlert((prev) => ({
        ...prev,
        message: "Failed to update order. Please try again.",
        type: "error",
      }));
    }
  };

  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          role="menu"
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => onViewClick(order)}
          >
            View
          </button>
          {order?.status !== "delivered" && (
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                handleUpdate();
                // updateOrderState(order, toMappings[state]);
                // console.log(`${order?.customer?.firstName} moved to ${state}`);
                // console.log(`moving to: ${toMappings[state]}`);
              }}
            >
              To{" "}
              {state === "pending"
                ? "In Progress"
                : state === "onprogress"
                ? "Completed"
                : state === "completed"
                ? "delivered"
                : ""}
            </button>
          )}
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

const OrderItem = ({ order, state, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const stateColors = {
    pending: {
      color: "hover:border-blue-500",
    },
    onprogress: {
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
  const { setDraggedOrder } = useOrders((state) => state);

  const time = formatDate(order?.date, true).slice(-8);
  const items = order?.servicesRendered || [];
  let totalQuantity = 0;
  for (let i of items) {
    totalQuantity += i?.quantity;
  }
  return (
    <div
      className={`bg-white p-3 rounded-[10px] my-2 border-2 border-transparent ${color} transition-all duration-300 cursor-move relative`}
      draggable
      onDragStart={() => setDraggedOrder(order)}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <small>{`${order?.customer?.firstName} ${order?.customer?.lastName}`}</small>
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
        <small>{order?.customer?.phone}</small>
        <small>WR</small>
      </div>
      <div className="flex items-center justify-between text-gray-400 my-1">
        <small>{order?.customer?.email}</small>
        {/* <small>WR</small> */}
      </div>
      <div className="my-2 flex items-center">
        {order?.servicesRendered?.map((item, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full bg-ash_light flex items-center justify-center"
          >
            {iconDictionary[item?.serviceItem?.name.toLowerCase()] ? (
              <img
                src={iconDictionary[item?.serviceItem?.name.toLowerCase()]}
                alt={item?.serviceItem?.name}
                width={25}
              />
            ) : (
              <p className="text-2xl">📦</p>
            )}
          </div>
        ))}
      </div>
      {/* bottom */}
      <div className="py-1 px-2 bg-ash_light rounded-[10px]">
        <div className="flex items-center justify-between">
          <small className="text-gray-500">Time</small>
          <small className="font-semibold text-gray-700">{time}</small>
        </div>
        <div className="flex items-center justify-between mt-2">
          <small className="text-gray-500">Day</small>
          <small className="font-semibold text-gray-700">
            {formatDate(order?.date)}
          </small>
        </div>
        <div className="flex items-center justify-between mt-2">
          <small className="text-gray-500">Quantity</small>
          <small className="font-semibold text-gray-700">{totalQuantity}</small>
        </div>
        <div className="flex items-center justify-between mt-2">
          <small className="text-gray-500">Price</small>
          <small className="font-semibold text-gray-700">
            GHC {order?.totalAmount}
          </small>
        </div>
      </div>

      <div
        className={`absolute top-0 left-0 w-full h-full rounded-md bg-black/20 ${
          isLoading ? "block" : "hidden"
        }`}
      ></div>
    </div>
  );
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default OrderItem;
