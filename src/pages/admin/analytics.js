import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { requireAdmin } from "@/lib/serverAuth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function SystemAnalytics() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    fetchActivityData();
  }, [currentPage]);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Admin token not found. Please login as admin.");
      }

      // Fetch activity logs
      const logsResponse = await fetch(
        `${API_URL}/api/activity/logs?limit=8&skip=${(currentPage - 1) * 8}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!logsResponse.ok) {
        const errorData = await logsResponse.text();
        console.error("Logs API Error:", errorData);
        throw new Error(
          `Failed to fetch activity logs: ${logsResponse.status}`,
        );
      }
      const logsData = await logsResponse.json();

      // Format the activity logs data
      const formattedLogs = logsData.activities.map((log) => ({
        timestamp: new Date(log.timestamp).toLocaleString(),
        user: log.user,
        action: log.action,
      }));

      setActivityLogs(formattedLogs);
      setTotalPages(logsData.pages);

      // Fetch top active users
      const usersResponse = await fetch(
        `${API_URL}/api/activity/top-users?limit=5&daysBack=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!usersResponse.ok) {
        const errorData = await usersResponse.text();
        console.error("Top Users API Error:", errorData);
        throw new Error("Failed to fetch top users");
      }
      const usersData = await usersResponse.json();
      setTopUsers(usersData.topUsers);

      // Fetch statistics
      const statsResponse = await fetch(
        `${API_URL}/api/activity/summary?daysBack=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!statsResponse.ok) {
        const errorData = await statsResponse.text();
        console.error("Stats API Error:", errorData);
        throw new Error("Failed to fetch statistics");
      }
      const statsInfo = await statsResponse.json();
      setStatsData(statsInfo.summary);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching activity data:", err);
      setError(
        err.message ||
          "Failed to load activity data. Make sure the backend is running.",
      );
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="px-4 sm:px-8 py-6">
        <div className="text-red-600 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            System Analytics
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Monitor system usage and performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
          <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none font-semibold text-gray-700 text-sm sm:text-base">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-sm sm:text-base">
            Export Report
          </button>
        </div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">
            Total Transcriptions
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {statsData?.activityBreakdown?.find(
              (s) => s._id === "Transcription Created",
            )?.count || 0}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Last 30 days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">
            Summaries Generated
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {statsData?.activityBreakdown?.find(
              (s) => s._id === "Summary Generated",
            )?.count || 0}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Last 30 days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Active Users</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {statsData?.uniqueUsers || 0}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Last 30 days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">
            Total Activities
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {statsData?.totalActivities || 0}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Last 30 days</p>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Usage Overview
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold">
              Daily
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold">
              Weekly
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold">
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="font-semibold">Chart Visualization</p>
            <p className="text-sm">Usage trends and analytics</p>
          </div>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Top Active Users
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {topUsers.length > 0 ? (
            topUsers.map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {user.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user.transcriptions} activities
                    </p>
                  </div>
                </div>
                <span className="text-indigo-600 font-bold">#{user.rank}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No user activity data available
            </p>
          )}
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Activity Logs
          </h2>
          <input
            type="text"
            placeholder="Search logs..."
            className="px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-sm sm:text-base w-full sm:w-64"
          />
        </div>
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 sm:px-6 py-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : activityLogs.length > 0 ? (
              activityLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600 font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-900 font-medium">
                    {log.user}
                  </td>
                  <td className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600">
                    {log.action}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 sm:px-6 py-4 text-center text-gray-500"
                >
                  No activity logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm sm:text-base text-gray-600">
            Showing 1-{activityLogs.length} of {totalPages * 8} logs
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SystemAnalytics.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default SystemAnalytics;

export const getServerSideProps = requireAdmin;
