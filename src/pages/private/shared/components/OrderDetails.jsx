import { iconDictionary } from "../../../../lib/data/IconsDictionary";
import PropTypes from "prop-types";

const OrderDetails = ({ itemId }) => {
  // const orderItem  = useFetchItem(orders, itemId) params are resourceType and itemId

  return (
    <>
      <article className="p-3 rounded-md bg-ash_light cursor-default">
        <div className="flex items-center justify-between my-3">
          <p>Customer Name {itemId}</p>
          <p className="font-semibold">Ibrahim Yakubu</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Email</p>
          <p className="font-semibold">yakubu@email.com</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Phone Number</p>
          <p className="font-semibold">+233505601239</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>House Number</p>
          <p className="font-semibold">505601239</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Time</p>
          <p className="font-semibold">08:12:05</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Date</p>
          <p className="font-semibold">25 Dec 2024</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Branch</p>
          <p className="font-semibold">Branch 1</p>
        </div>
      </article>

      <article className="p-3 rounded-md bg-ash_light my-5 cursor-default">
        <div className="flex items-center justify-between my-3">
          <p>Item Name</p>
          <div className="flex items-center space-x-2">
            <img
              src={iconDictionary?.jeans}
              alt={"jeans"}
              className="w-[26px] h-auto"
            />
            <p className="font-semibold">Jeans</p>
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Service</p>
          <p className="font-semibold">Wash</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Quantity</p>
          <p className="font-semibold">4</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Iron</p>
          <p className="font-semibold">Yes</p>
        </div>
      </article>

      <article className="p-3 rounded-md bg-ash_light my-5 cursor-default">
        <div className="flex items-center justify-between my-3">
          <p>Item Name</p>
          <div className="flex items-center space-x-2">
            <img
              src={iconDictionary?.t_shirt}
              alt={"t_shirt"}
              className="w-[26px] h-auto"
            />
            <p className="font-semibold">T-Shirt</p>
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Service</p>
          <p className="font-semibold">Iron</p>
        </div>
        <div className="flex items-center justify-between my-3">
          <p>Quantity</p>
          <p className="font-semibold">4</p>
        </div>
      </article>

      <div className="flex items-center justify-between mt-10 px-3">
        <p>Total</p>
        <p className="font-semibold">GHC 180</p>
      </div>
    </>
  );
};

OrderDetails.propTypes = {
  itemId: PropTypes.number.isRequired,
};

export default OrderDetails;
