import PropTypes from "prop-types";

const EditServiceForm = ({ itemId }) => {
  return <div>Edit Service: {itemId}</div>;
};

EditServiceForm.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default EditServiceForm;
