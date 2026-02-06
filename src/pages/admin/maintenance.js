import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

function SystemMaintenance() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const systemInfo = {
    version: "2.4.1",
    lastUpdate: "2024-10-15",
    uptime: "45 days, 12 hours",
    serverLoad: "34%",
    database: "MONGODB",
  };

  const recentUpdates = [
    { version: "2.4.1", date: "2024-10-15", description: "Security patches and bug fixes", type: "Patch" },
    { version: "2.4.0", date: "2024-09-28", description: "Multi-language support added", type: "Minor" },
    { version: "2.3.5", date: "2024-09-10", description: "Performance improvements", type: "Patch" },
    { version: "2.3.0", date: "2024-08-22", description: "New summary generation engine", type: "Minor" },
  ];

  const scheduledTasks = [
    { task: "Database Backup", schedule: "Daily at 2:00 AM", lastRun: "2024-10-27 02:00", status: "Completed" },
    { task: "Log Cleanup", schedule: "Weekly on Sunday", lastRun: "2024-10-20 03:00", status: "Completed" },
    { task: "Cache Clear", schedule: "Every 6 hours", lastRun: "2024-10-27 12:00", status: "Completed" },
    { task: "Security Scan", schedule: "Daily at 4:00 AM", lastRun: "2024-10-27 04:00", status: "Completed" },
  ];

 return (
  <AdminLayout>
    <div className="px-4 sm:px-8 py-6 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            System Maintenance
          </h1>
          <p className="text-gray-600 mt-1">Manage system updates and maintenance</p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Upload new APK file
            </button>
          </div>

        {/* Top Stats - Now 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* System Version */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">System Version</h3>
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{systemInfo.version}</p>
            <p className="text-sm text-gray-500">Last updated: {systemInfo.lastUpdate}</p>
          </div>

          {/* System Uptime */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">System Uptime</h3>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">99.8%</p>
            <p className="text-sm text-gray-500">{systemInfo.uptime}</p>
          </div>

          {/* Database Section moved up */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">Database</h3>
            <p className="text-xl font-bold text-gray-900">{systemInfo.database}</p>
            <p className="text-sm text-gray-500 mt-2">Daily Backups Enabled</p>
          </div>

        </div>

        {/* Controls + Info side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* System Controls */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">System Controls</h2>

            {/* Maintenance Mode */}
            <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Maintenance Mode
                </h3>
                <p className="text-sm text-gray-600">Disable user access temporarily</p>
              </div>

              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors 
                  ${maintenanceMode ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-6 w-6 transform bg-white rounded-full transition-transform 
                  ${maintenanceMode ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Auto Backup */}
            <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Auto Backup
                </h3>
                <p className="text-sm text-gray-600">Daily automated backups</p>
              </div>

              <button
                onClick={() => setAutoBackup(!autoBackup)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors 
                  ${autoBackup ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-6 w-6 transform bg-white rounded-full transition-transform 
                  ${autoBackup ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">System Information</h2>

            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-600">Database</p>
                <p className="font-semibold">{systemInfo.database}</p>
              </div>
              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-600">Last Backup</p>
                <p className="font-semibold">Today at 2:00 AM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Scheduled Backup</p>
                <p className="font-semibold">Tomorrow at 2:00 AM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Update History Full Width */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Update History</h2>

          {recentUpdates.map((update, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                update.type === "Minor"
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-green-100 text-green-600"
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900">v{update.version}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    update.type === "Minor"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {update.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{update.description}</p>
                <p className="text-xs text-gray-500">{update.date}</p>
              </div>
            </div>
          ))}
        </div>

    </div>
  </AdminLayout>
);
}

export default function ProtectedSystemMaintenance() {
  return (
    <ProtectedAdminRoute>
      <SystemMaintenance />
    </ProtectedAdminRoute>
  );
}
