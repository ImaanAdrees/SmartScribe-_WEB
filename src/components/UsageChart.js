import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

/**
 * UsageChart component for analytics usage trends
 * @param {Object[]} data - Array of usage data objects
 * @param {string} filter - Current filter ("daily", "weekly", "monthly")
 * @param {function} onFilterChange - Callback for filter change
 */
const UsageChart = ({ data, filter, onFilterChange }) => {
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            filter === "daily"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onFilterChange("daily")}
        >
          Daily
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            filter === "weekly"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onFilterChange("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            filter === "monthly"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => onFilterChange("monthly")}
        >
          Monthly
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="transcriptions" fill="#6366f1" name="Transcriptions" />
          <Bar dataKey="summaries" fill="#10b981" name="Summaries" />
          <Bar dataKey="activities" fill="#f59e42" name="Activities" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
