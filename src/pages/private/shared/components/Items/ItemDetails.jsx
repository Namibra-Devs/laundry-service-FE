import useAppContext from "@/hooks/useAppContext";

const ItemDetails = () => {
  const { currentItem: item } = useAppContext();
  return <div>Item Details For: {item?.id}</div>;
};

export default ItemDetails;
