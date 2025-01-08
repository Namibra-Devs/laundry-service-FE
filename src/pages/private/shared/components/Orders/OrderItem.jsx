import PropTypes from "prop-types";
import { iconDictionary } from "../../../../../lib/data/IconsDictionary";
import { Ellipsis } from "lucide-react";

const OrderItem = ({ order, state }) => {
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
      className={`bg-white p-3 rounded-[10px] my-2 border-2 border-transparent ${color} transition-all duration-300 cursor-default`}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <small>{order?.customerName}</small>
        <Ellipsis className="cursor-pointer" />
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
