import useAppContext from "@/hooks/useAppContext";
import { iconDictionary } from "../../../../lib/data/IconsDictionary";
import { formatDate } from "@/lib/utils/formatDate";

const OrderDetails = () => {
  const { currentItem: order } = useAppContext();

  const time = formatDate(order?.date, true).slice(-8);

  return (
    <>
      <article className="p-3 rounded-md bg-ash_light cursor-default">
        <div className="flex items-center justify-between my-3">
          <p>Customer Name</p>
          <p className="font-semibold">
            {order?.customer?.firstName + " " + order?.customer?.lastName}
          </p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Email</p>
          <p className="font-semibold">{order?.customer?.email}</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Phone Number</p>
          <p className="font-semibold">{order?.customer?.phone}</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Time</p>
          <p className="font-semibold">{time}</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Date</p>
          <p className="font-semibold">{formatDate(order?.date)}</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Branch</p>
          <p className="font-semibold">{order?.branch?.name}</p>
        </div>
      </article>

      {order?.servicesRendered?.map((item, index) => (
        <article
          key={index}
          className="p-3 rounded-md bg-ash_light my-5 cursor-default"
        >
          <div className="flex items-center justify-between my-3">
            <p>Item Name</p>
            <div className="flex items-center space-x-2">
              {iconDictionary[item?.serviceItem?.name.toLowerCase()] ? (
                <img
                  src={iconDictionary[item?.serviceItem?.name.toLowerCase()]}
                  alt={item?.serviceItem?.name}
                  width={25}
                />
              ) : (
                <p className="text-2xl">📦</p>
              )}
              <p className="font-semibold">{item?.serviceItem?.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between my-3">
            <p>Service</p>
            <p className="font-semibold">{item?.service}</p>
          </div>
          <div className="flex items-center justify-between my-3">
            <p>Quantity</p>
            <p className="font-semibold">{item?.quantity}</p>
          </div>
          <div className="flex items-center justify-between my-3">
            <p>Iron</p>
            <p className="font-semibold">{item?.isIroned ? "Yes" : "No"}</p>
          </div>
        </article>
      ))}

      <div className="flex items-center justify-between mt-10 px-3">
        <p>Total</p>
        <p className="font-semibold">GHC {order?.totalAmount}</p>
      </div>
    </>
  );
};

export default OrderDetails;
