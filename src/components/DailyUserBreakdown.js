import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import { getAdminToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function DetailsTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white p-3 rounded-lg border shadow-lg w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">{item.name}</div>
        <div className="text-xs text-gray-500">{item.value}</div>
      </div>
      <div className="space-y-2">
        {Object.entries(item.counts || {}).map(([action, count]) => (
          <div key={action} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
              <div className="text-sm text-gray-700">{action}</div>
            </div>
            <div className="text-sm font-medium text-gray-900">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DailyUserBreakdown({ daysBack = 1, limit = 10 }) {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState("total"); // 'total' | 'Transcription Created' | 'Summary Generated' | other actions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = getAdminToken();
      try {
        const { data } = await axios.get(
          `${API_URL}/api/activity/top-users-breakdown?daysBack=${daysBack}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const mapped = (data.topUsers || []).map((u) => ({
          name: u.userName || u.userEmail,
          counts: u.counts || {},
          total: u.total || 0,
        }));
        setData(mapped.reverse()); // reverse for nicer bar orientation (small->big) if needed
      } catch (err) {
        console.error("Failed to load daily user breakdown", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listener
    const { getSocket } = require("@/lib/socket");
    const socket = getSocket();
    if (socket) {
      socket.on("analytics_update", fetchData);
      return () => {
        socket.off("analytics_update", fetchData);
      };
    }
  }, [daysBack, limit]);

  // Prepare chart data and sort by value desc so top users appear first
  const chartData = data
    .map((d) => ({
      name: d.name,
      counts: d.counts,
      total: d.total,
      value: metric === "total" ? d.total : d.counts[metric] || 0,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              metric === "total" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setMetric("total")}
          >
            Total Activities
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              metric === "Transcription Created" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setMetric("Transcription Created")}
          >
            Transcriptions
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              metric === "Summary Generated" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setMetric("Summary Generated")}
          >
            Summaries
          </button>
        </div>
        <div className="text-sm text-gray-500">Showing top {limit} users</div>
      </div>

      {loading ? (
        <div className="h-56 w-full bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <div className="flex justify-center">
          <div style={{ width: "85%", maxWidth: 820, height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 12, left: -17, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} tick={{ fill: "#374151", fontSize: 14 }} />
                <Tooltip content={<DetailsTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" name={metric === "total" ? "Total Activities" : metric} radius={[6, 6, 6, 6]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
