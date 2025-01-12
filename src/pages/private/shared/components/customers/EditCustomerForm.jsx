import useAppContext from "@/hooks/useAppContext";

const EditCustomerForm = () => {
  const { currentItem: customer } = useAppContext();
  return <div>Edit Customer: {customer?.name}</div>;
};

export default EditCustomerForm;
