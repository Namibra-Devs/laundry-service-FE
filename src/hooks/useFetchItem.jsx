import PropTypes from "prop-types";

const useFetchItem = ({ resourceType, itemId }) => {
  return <div>useFetchAllItems</div>;
};

useFetchItem.propTypes = {
  resourceType: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
};

export default useFetchItem;
