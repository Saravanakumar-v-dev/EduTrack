import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/*
|--------------------------------------------------------------------------
| ChartCard Component
|--------------------------------------------------------------------------
| Props:
| - title        : string
| - subtitle     : string (optional)
| - data         : array
| - type         : "line" | "bar" | "pie"
| - dataKey      : string (primary metric)
| - xKey         : string (x-axis key)
| - color        : string (chart color)
| - height       : number (default 280)
|--------------------------------------------------------------------------
*/

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

const ChartCard = ({
  title,
  subtitle,
  data = [],
  type = "line",
  dataKey,
  xKey,
  color = "#6366f1",
  height = 280,
}) => {
  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          No data available
        </div>
      );
    }

    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6"
    >
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* CHART */}
      <div className="w-full">{renderChart()}</div>
    </motion.div>
  );
};

export default ChartCard;
