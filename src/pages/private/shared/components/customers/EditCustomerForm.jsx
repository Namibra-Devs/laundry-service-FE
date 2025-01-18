import useAppContext from "@/hooks/useAppContext";
import PropTypes from "prop-types";

const EditCustomerForm = ({ refetchFunction }) => {
  const { currentItem: customer } = useAppContext();
  return <div>Edit Customer: {customer?.name}</div>;
};

EditCustomerForm.propTypes = {
  refetchFunction: PropTypes.func.isRequired,
};
export default EditCustomerForm;
