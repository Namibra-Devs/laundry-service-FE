import PropTypes from "prop-types";

const CustomerDetails = ({ itemId }) => {
  return <div>Customer Details For: {itemId}</div>;
};

CustomerDetails.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default CustomerDetails;
