import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

function SystemAnalytics() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activityLogs = [
    { timestamp: "2024-10-27 14:32:15", user: "john@example.com", action: "Transcription Created" },
    { timestamp: "2024-10-27 14:28:42", user: "jane@example.com", action: "Summary Generated" },
    { timestamp: "2024-10-27 14:15:03", user: "mike@example.com", action: "Login Attempt" },
    { timestamp: "2024-10-27 14:10:27", user: "sarah@example.com", action: "Profile Updated" },
    { timestamp: "2024-10-27 13:58:11", user: "david@example.com", action: "Export PDF" },
    { timestamp: "2024-10-27 13:45:39", user: "emily@example.com", action: "Transcription Created" },
    { timestamp: "2024-10-27 13:30:22", user: "chris@example.com", action: "File Upload" },
    { timestamp: "2024-10-27 13:12:55", user: "lisa@example.com", action: "Summary Generated" }
  ];

  return (
      <div className="px-4 sm:px-8 py-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Analytics</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor system usage and performance</p>
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
              <p className="text-gray-600 text-sm font-medium mb-1">Total Transcriptions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">5,678</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Last 30 days</p>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium mb-1">Summaries Generated</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">3,456</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Last 30 days</p>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium mb-1">Avg. Processing Time</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">2.4s</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Per transcription</p>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-medium mb-1">Success Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">99.2%</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">System uptime</p>
            </div>
          </div>

          {/* Usage Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Usage Overview</h2>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold">Daily</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold">Weekly</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-semibold">Monthly</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="font-semibold">Chart Visualization</p>
                <p className="text-sm">Usage trends and analytics</p>
              </div>
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Top Active Users</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: "Jane Smith", transcriptions: 89, avatar: "J" },
                { name: "David Brown", transcriptions: 71, avatar: "D" },
                { name: "Chris Wilson", transcriptions: 54, avatar: "C" },
                { name: "John Doe", transcriptions: 45, avatar: "J" },
                { name: "Mike Johnson", transcriptions: 32, avatar: "M" }
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{user.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{user.transcriptions} transcriptions</p>
                    </div>
                  </div>
                  <span className="text-indigo-600 font-bold">#{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Activity Logs</h2>
              <input
                type="text"
                placeholder="Search logs..."
                className="px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-sm sm:text-base w-full sm:w-64"
              />
            </div>
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activityLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600 font-mono">{log.timestamp}</td>
                    <td className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-900 font-medium">{log.user}</td>
                    <td className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600">{log.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm sm:text-base text-gray-600">Showing 1-8 of 234 logs</p>
              <div className="flex gap-2">
                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm sm:text-base font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>

      </div>
  );
}

function ProtectedSystemAnalytics() {
  return (
    <ProtectedAdminRoute>
      <SystemAnalytics />
    </ProtectedAdminRoute>
  );
}

ProtectedSystemAnalytics.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProtectedSystemAnalytics;
