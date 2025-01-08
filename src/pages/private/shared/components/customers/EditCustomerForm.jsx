import PropTypes from "prop-types";

const EditCustomerForm = ({ itemId }) => {
  return <div>Edit Customer: {itemId}</div>;
};

EditCustomerForm.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default EditCustomerForm;
