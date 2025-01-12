import useAppContext from "@/hooks/useAppContext";

const CustomerDetails = () => {
  const { currentItem: customer } = useAppContext();

  return <div>Customer Details For: {customer?.id}</div>;
};

export default CustomerDetails;
