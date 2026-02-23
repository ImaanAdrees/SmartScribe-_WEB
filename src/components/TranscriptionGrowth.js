import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import axios from "axios";
import { getAdminToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function TranscriptionGrowth({ daysBack = 7 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (silent = false) => {
      if (!silent) setLoading(true);
      const token = getAdminToken();
      try {
        const resp = await axios.get(
          `${API_URL}/api/activity/usage?filter=daily&daysBack=${daysBack}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const mapped = (resp.data.data || []).map((d) => ({
          label: new Date(d.period).toLocaleDateString(),
          transcriptions: d.transcriptions || 0,
        }));
        setData(mapped);
      } catch (err) {
        console.error("Failed to load transcription growth", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time listener
    const { getSocket } = require("@/lib/socket");
    const socket = getSocket();
    if (socket) {
      const handleUpdate = () => fetchData(true);
      socket.on("analytics_update", handleUpdate);
      return () => {
        socket.off("analytics_update", handleUpdate);
      };
    }
  }, [daysBack]);

  return (
    <div>
      {loading ? (
        <div className="h-56 w-full bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: "#374151" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#374151" }} />
              <Tooltip />
              <Line type="monotone" dataKey="transcriptions" stroke="#6366f1" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
