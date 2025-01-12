import useAppContext from "@/hooks/useAppContext";

const EditServiceForm = () => {
  const { currentItem: service } = useAppContext();
  return <div>Edit Service: {service?.name}</div>;
};
export default EditServiceForm;
