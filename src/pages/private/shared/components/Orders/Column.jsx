import PropTypes from "prop-types";
import OrderItem from "./OrderItem";
import { Ellipsis } from "lucide-react";
import { useOrders } from "../../../../../lib/store/OrdersStore";
import { shallow } from "zustand/shallow";
import { useMemo } from "react";

const Column = ({ state }) => {
  const stateColors = {
    pending: {
      main: "bg-blue-500",
      //   fade: "custom_blue_fade",
      fade: "bg-blue-200",
    },
    in_progress: {
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

  //   const orders = useOrders(
  //     (store) => store.orders.filter((order) => order?.state === state),
  //     shallow
  //   );

  const orders = useOrders((store) => store.orders);

  //   const filtered = useMemo(() => {
  //     orders.filter((order) => order.state === state);
  //   }, [orders, state]);

  //   console.log(state);
  const { main, fade } = stateColors[state] || "";

  const count = 10;

  return (
    <div className="h-[75vh] bg-ash_light p-2 rounded-md">
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
            {count > 9 ? "9+" : count}
          </div>
        </div>

        <Ellipsis className="cursor-pointer" />
      </div>

      <div className="order_column h-[70vh] overflow-y-auto">
        {orders?.map((order) => (
          <OrderItem key={order?.id} order={order} state={state} />
        ))}
      </div>
    </div>
  );
};

Column.propTypes = {
  state: PropTypes.string.isRequired,
};
export default Column;
