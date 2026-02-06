"use client";
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12.5%",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Transcriptions",
      value: "5,678",
      change: "+8.2%",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      title: "Summaries Generated",
      value: "3,456",
      change: "+15.3%",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
 {
  title: "Total Exports",
  value: "89",
  change: "+5.1%",
  icon: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 16v-4a4 4 0 014-4h4m4 0h4a4 4 0 014 4v4m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  ),
  bgColor: "bg-indigo-50",
  iconColor: "text-indigo-600"
}

  ];

  return (
    <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin</p>
        </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                  <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Usage Graphs Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Usage Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Graph Card 1 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Daily Users</h3>
                <div className="h-56 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Graph Card 2 */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-4">Transcriptions Growth</h3>
                <div className="h-56 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

            </div>
      </div>
    </div>
  );
}

function ProtectedDashboard() {
  return (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  );
}

// Persistent layout - prevents sidebar/navbar from re-rendering
ProtectedDashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProtectedDashboard;
