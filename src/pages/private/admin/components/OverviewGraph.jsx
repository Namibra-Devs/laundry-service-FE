import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  //   CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

const OverviewGraph = ({ data }) => {
  return (
    <div className="w-[500px] sm:w-[1200px] lg:w-full h-[95%]">
      <ResponsiveContainer>
        <AreaChart
          // width="50%"
          // height="100%"
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Fill Gradient */}
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18A0FB" stopOpacity={1} />
              <stop offset="50%" stopColor="#18A0FB" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#fff" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#18A0FB"
            fill="url(#fillGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

OverviewGraph.propTypes = {
  data: PropTypes.array.isRequired,
};
export default OverviewGraph;
