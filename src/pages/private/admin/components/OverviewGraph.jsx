// import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  //   CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the graph
const data = [
  { name: "Jan", orders: 700 },
  { name: "Feb", orders: 900 },
  { name: "Mar", orders: 1000 },
  { name: "Apr", orders: 900 },
  { name: "May", orders: 1100 },
  { name: "Jun", orders: 1300 },
  { name: "Jul", orders: 600 },
  { name: "Aug", orders: 700 },
  { name: "Sep", orders: 600 },
  { name: "Oct", orders: 700 },
  { name: "Nov", orders: 1000 },
  { name: "Dec", orders: 500 },
];

const OverviewGraph = () => {
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

          {/* <CartesianGrid strokeDasharray="3 3" /> */}
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
export default OverviewGraph;
