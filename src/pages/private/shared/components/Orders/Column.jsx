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

const OptionsDropDown = ({ isOpen, isCollapsed, setIsCollapsed, state }) => {
  const handleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-[100]"
          role="menu"
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            onClick={handleCollapse}
          >
            {isCollapsed ? "Expand" : "Collapse"}
          </button>
          <button
            className={`${
              state === "delivered" ? "hidden" : "block"
            } w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
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
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};

const Column = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const { orders, triggerUpdate, setAlert } = useAppContext();
  const [loading, setLoading] = useState(false);

  const filteredOrders = useMemo(
    () => orders?.filter((order) => order.status === state),
    [orders, state]
  );

  const { main, fade } = stateColors[state] || "";

  const { draggedOrder, setDraggedOrder } = useOrders((state) => state);

  const {
    auth: { accessToken },
  } = useAuth();

  const stateOrder = ["pending", "onprogress", "completed", "delivered"];

  const canUpdateOrder = (currentState, toState) => {
    const currentIndex = stateOrder.indexOf(currentState);
    const toIndex = stateOrder.indexOf(toState);

    return toIndex > currentIndex;
  };

  const handleDrop = async () => {
    if (!draggedOrder) return;

    // Validate state transition before making an API request
    if (!canUpdateOrder(draggedOrder?.status, state)) {
      setAlert((prev) => ({
        ...prev,
        message: "Invalid state transition. You cannot move an order backward",
        type: "error",
      }));
      return;
    }

    setDraggedOrder(null);
    setDrop(false);
    setLoading(true);

    try {
      const { data, message } = await updateOrderState(
        accessToken,
        draggedOrder?._id,
        state
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
    } finally {
      setLoading(false);
      console.log(loading);
    }
  };

  return (
    <div
      className={`${
        isCollapsed ? "h-[7vh]" : "h-[70vh]"
      } bg-ash_light p-2 rounded-md relative overflow-hidden ${
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
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-3 ${fade} py-1 px-2 rounded-md`}
        >
          <small className="capitalize">
            {state === "onprogress" ? "in progress" : state}
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
        <OptionsDropDown
          isOpen={isOpen}
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
          state={state}
        />
      </div>

      <div className="order_column h-[70vh] overflow-y-auto">
        {filteredOrders?.map((order) => (
          <OrderItem
            key={order?._id}
            order={order}
            state={state}
            isLoading={loading}
          />
        ))}
      </div>
    </div>
  );
};

Column.propTypes = {
  state: PropTypes.string.isRequired,
};
export default Column;
