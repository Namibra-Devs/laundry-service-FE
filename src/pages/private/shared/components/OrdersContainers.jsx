import Column from "./Orders/Column";

const OrdersContainers = () => {
  return (
    <div className="grid grid-cols-4 gap-5 mt-3 w-[70rem] sm:w-full">
      <Column state="pending" />
      <Column state="in_progress" />
      <Column state="completed" />
      <Column state="delivered" />
    </div>
  );
};
export default OrdersContainers;
