import PropTypes from "prop-types";

const EditBranchForm = ({ itemId }) => {
  return <div>Editing Branch: {itemId}</div>;
};

EditBranchForm.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default EditBranchForm;
