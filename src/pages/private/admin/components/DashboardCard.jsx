import { ArrowUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import PropTypes from "prop-types";

const DashboardCard = ({ icon, label, count, metric }) => {
  return (
    <div className="dashboard_card bg-white p-5 rounded-[1rem] cursor-default flex-grow-[1] w-[150px] sm:w-[200px] lg:w-[300px]">
      <div className="flex items-center justify-between">
        <span className="text-dark text-[17px] capitalize">{label}</span>
        <div className="bg-custom_yellow_fade text-custom_yellow_dark w-14 h-14 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-5">
        <h4 className="font-[700] text-3xl">{count}</h4>
        {metric && (
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center ${
                Number(metric) > 0 ? "text-success" : "text-danger"
              }`}
            >
              <span>{Number(metric) < 0 ? <ArrowDown /> : <ArrowUp />}</span>
              <span>{metric}%</span>
            </div>
            <small className="text-gray-400">vs Last Month</small>
          </div>
        )}
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  metric: PropTypes.number,
};

export default DashboardCard;
