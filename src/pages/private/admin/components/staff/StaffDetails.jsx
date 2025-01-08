import PropTypes from "prop-types";

const StaffDetails = ({ itemId }) => {
  return <div>Staff Details for: {itemId}</div>;
};

StaffDetails.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default StaffDetails;
