import PropTypes from "prop-types";

const EditItemForm = ({ itemId }) => {
  return <div>Edit Item: {itemId}</div>;
};

EditItemForm.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default EditItemForm;
