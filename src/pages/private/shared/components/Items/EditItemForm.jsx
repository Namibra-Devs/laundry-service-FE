import useAppContext from "@/hooks/useAppContext";

const EditItemForm = () => {
  const { currentItem: item } = useAppContext();
  return <div>Edit Item: {item?.id}</div>;
};

export default EditItemForm;
