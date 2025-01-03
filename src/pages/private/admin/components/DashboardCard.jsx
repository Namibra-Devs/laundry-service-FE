import PropTypes from "prop-types";

const DashboardCard = ({ icon, label, count }) => {
  return (
    <div className="dashboard_card bg-white p-5 rounded-[1rem] cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-dark text-[17px] capitalize">{label}</span>
        <div className="bg-custom_yellow_fade text-custom_yellow_dark w-14 h-14 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <h4 className="font-[700] text-3xl">{count}</h4>
        <p className="text-gray-400 capitalize text-base">some text</p>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export default DashboardCard;
