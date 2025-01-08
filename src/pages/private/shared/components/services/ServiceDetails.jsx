import PropTypes from "prop-types";

const ServiceDetails = ({ itemId }) => {
  return <div>Service Details For: {itemId}</div>;
};

ServiceDetails.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default ServiceDetails;
