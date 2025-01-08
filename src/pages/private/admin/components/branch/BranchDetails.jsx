import PropTypes from "prop-types";

const BranchDetails = ({ itemId }) => {
  return <div>Branch Details For: {itemId}</div>;
};

BranchDetails.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default BranchDetails;
