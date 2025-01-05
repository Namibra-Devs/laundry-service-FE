import PropTypes from "prop-types";

const EditOrder = ({ itemId }) => {
  return <div>Edit Order Item: {itemId}</div>;
};

EditOrder.propTypes = {
  itemId: PropTypes.number.isRequired,
};

export default EditOrder;
