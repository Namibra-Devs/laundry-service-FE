import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import { Ellipsis } from "lucide-react";
import { useOrders } from "../../../../../lib/store/OrdersStore";
import { useMemo } from "react";
// import OptionsDropDown from "./OptionsDropDown";
import { useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import { updateOrderState } from "@/lib/utils/updateOrderState";
import useAuth from "@/hooks/useAuth";

const OptionsDropDown = ({ isOpen }) => {
  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          role="menu"
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Collapse Group
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Move All To Next
          </button>
        </div>
      )}
    </div>
  );
};

OptionsDropDown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

const Column = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const stateColors = {
    pending: {
      main: "bg-blue-500",
      fade: "bg-blue-200",
    },
    onprogress: {
      main: "bg-custom_yellow_dark",
      fade: "bg-yellow-200/60",
    },
    completed: {
      main: "bg-custom_green",
      fade: "bg-green-600/30",
    },
    delivered: {
      main: "bg-gray-400",
      fade: "bg-gray-200",
    },
  };

  // const orders = useOrders((store) => store.orders);

  const { orders, triggerUpdate } = useAppContext();

  const filteredOrders = useMemo(
    () => orders?.filter((order) => order.status === state),
    [orders, state]
  );

  const { main, fade } = stateColors[state] || "";

  const { draggedOrder, setDraggedOrder, moveOrder } = useOrders(
    (state) => state
  );

  const {
    auth: { accessToken },
  } = useAuth();

  return (
    <div
      className={`h-[75vh] bg-ash_light p-2 rounded-md relative ${
        drop && "border-dashed border-2 border-gray-400"
      }`}
      onDragOver={(e) => {
        setDrop(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDrop(false);
        e.preventDefault();
      }}
      onDrop={() => {
        setDraggedOrder(null);
        setDrop(false);
        // moveOrder(draggedOrder, state);
        updateOrderState(accessToken, draggedOrder?._id, state);
        triggerUpdate("order");
        // console.log(`${draggedOrder?.customer?.firstName} moved to ${state}`);
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-3 ${fade} py-1 px-2 rounded-md`}
        >
          <small className="capitalize">
            {state === "in_progress" ? "in progress" : state}
          </small>
          <div
            className={`w-6 h-6 rounded-full text-[12px] text-white flex items-center justify-center ${main}`}
          >
            {filteredOrders
              ? filteredOrders.length > 9
                ? "9+"
                : filteredOrders.length
              : 0}
          </div>
        </div>

        <Ellipsis
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>

      <div className="absolute top-2 right-0">
        <OptionsDropDown isOpen={isOpen} />
      </div>

      <div className="order_column h-[70vh] overflow-y-auto">
        {filteredOrders?.map((order) => (
          <OrderItem key={order?._id} order={order} state={state} />
        ))}
      </div>
    </div>
  );
};

Column.propTypes = {
  state: PropTypes.string.isRequired,
};
export default Column;
