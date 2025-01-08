import PropTypes from "prop-types";

const EditStaffForm = ({ itemId }) => {
  return <div>Edit Staff: {itemId}</div>;
};

EditStaffForm.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default EditStaffForm;
