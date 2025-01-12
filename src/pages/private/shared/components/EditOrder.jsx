import useAppContext from "@/hooks/useAppContext";

const EditOrder = () => {
  const { currentItem: order } = useAppContext();
  return <div>Edit Order Item: {order?.id}</div>;
};

export default EditOrder;
