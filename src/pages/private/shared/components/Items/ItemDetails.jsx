import PropTypes from "prop-types";

const ItemDetails = ({ itemId }) => {
  return <div>Item Details For: {itemId}</div>;
};

ItemDetails.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default ItemDetails;
