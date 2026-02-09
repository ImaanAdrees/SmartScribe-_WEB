import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function SystemMaintenance() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [backupTriggering, setBackupTriggering] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    version: "2.4.1",
    lastUpdate: "2024-10-15",
    uptime: "45 days, 12 hours",
    serverLoad: "34%",
    database: "MONGODB",
    lastBackupDate: null,
    nextScheduledBackup: null,
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [backupHistory, setBackupHistory] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showUploadModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUploadModal]);

  // Form states for APK upload
  const [apkFile, setApkFile] = useState(null);
  const [version, setVersion] = useState("");
  const [features, setFeatures] = useState("");
  const [improvements, setImprovements] = useState("");
  const [bugFixes, setBugFixes] = useState("");
  
  // Backup Scheduling states
  const [backupConfig, setBackupConfigState] = useState({
    backupTime: "02:00",
    oneTimeBackupEnabled: false,
    oneTimeScheduledBackup: "",
  });
  const [updatingConfig, setUpdatingConfig] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Fetch system info on mount
  useEffect(() => {
    setMounted(true);
    fetchSystemInfo();
    fetchUpdateHistory();
    fetchBackupHistory();
    fetchBackupConfig();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/api/maintenance/system-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setSystemInfo({
          version: data.data.version,
          lastUpdate: new Date(data.data.lastUpdate).toLocaleDateString(),
          uptime: data.data.uptime,
          serverLoad: data.data.serverLoad,
          database: data.data.database,
          lastBackupDate: data.data.lastBackupDate,
          nextScheduledBackup: data.data.nextScheduledBackup,
        });
        setMaintenanceMode(data.data.maintenanceMode);
      }
    } catch (err) {
      console.error("Error fetching system info:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdateHistory = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/api/maintenance/update-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setRecentUpdates(data.data);
      }
    } catch (err) {
      console.error("Error fetching update history:", err);
    }
  };

  const fetchBackupHistory = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/api/maintenance/backup-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setBackupHistory(data.data);
      }
    } catch (err) {
      console.error("Error fetching backup history:", err);
    }
  };

  const fetchBackupConfig = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/api/maintenance/backup-config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setAutoBackup(data.data.backupConfig.autoBackupEnabled);
        setBackupConfigState({
          backupTime: data.data.backupConfig.backupTime,
          oneTimeBackupEnabled: data.data.backupConfig.oneTimeBackupEnabled,
          oneTimeScheduledBackup: data.data.backupConfig.oneTimeScheduledBackup ? 
            new Date(data.data.backupConfig.oneTimeScheduledBackup).toISOString().slice(0, 16) : "",
        });
      }
    } catch (err) {
      console.error("Error fetching backup config:", err);
    }
  };

  const handleMaintenanceModeToggle = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${API_URL}/api/maintenance/toggle-mode`, 
        { maintenanceMode: !maintenanceMode },
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = response.data;
      if (data.success) {
        setMaintenanceMode(!maintenanceMode);
        setSuccess(`Maintenance mode ${!maintenanceMode ? "enabled" : "disabled"}`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error toggling maintenance mode");
      console.error(err);
    }
  };

  const handleAPKUpload = async (e) => {
    e.preventDefault();
    if (!apkFile || !version) {
      setError("Please select a file and enter version number");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("apk", apkFile);
      formData.append("version", version);
      formData.append("features", JSON.stringify(features.split(",").map(f => f.trim()).filter(f => f)));
      formData.append("improvements", JSON.stringify(improvements.split(",").map(i => i.trim()).filter(i => i)));
      formData.append("bugFixes", JSON.stringify(bugFixes.split(",").map(b => b.trim()).filter(b => b)));

      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${API_URL}/api/maintenance/upload-apk`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      if (data.success) {
        setSuccess("APK uploaded successfully!");
        setApkFile(null);
        setVersion("");
        setFeatures("");
        setImprovements("");
        setBugFixes("");
        setShowUploadModal(false);
        fetchUpdateHistory();
        fetchSystemInfo();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error uploading APK");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAutoBackupToggle = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${API_URL}/api/maintenance/update-backup-config`, 
        { autoBackupEnabled: !autoBackup },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      if (data.success) {
        setAutoBackup(!autoBackup);
        setSuccess(`Auto backup ${!autoBackup ? "enabled" : "disabled"}`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error updating backup configuration");
      console.error(err);
    }
  };

  const handleBackupConfigUpdate = async (e) => {
    e.preventDefault();
    setUpdatingConfig(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${API_URL}/api/maintenance/update-backup-config`, 
        {
          autoBackupEnabled: autoBackup,
          backupTime: backupConfig.backupTime,
          oneTimeBackupEnabled: backupConfig.oneTimeBackupEnabled,
          oneTimeScheduledBackup: backupConfig.oneTimeScheduledBackup,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      if (data.success) {
        setSuccess("Backup configuration updated successfully");
        fetchBackupConfig();
        fetchSystemInfo();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error updating backup configuration");
      console.error(err);
    } finally {
      setUpdatingConfig(false);
    }
  };

  const handleTriggerBackup = async () => {
    setBackupTriggering(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(`${API_URL}/api/maintenance/trigger-backup`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setSuccess("Backup triggered successfully!");
        fetchBackupHistory();
        fetchSystemInfo();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error triggering backup");
      console.error(err);
    } finally {
      setBackupTriggering(false);
    }
  };

  const handleDeleteVersion = async (versionId) => {
    if (!window.confirm("Are you sure you want to delete this APK version? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(`${API_URL}/api/maintenance/delete-apk/${versionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      if (data.success) {
        setSuccess("APK version deleted successfully!");
        fetchUpdateHistory();
        fetchSystemInfo();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error deleting APK version");
      console.error(err);
    }
  };

  const scheduledTasks = [
    { task: "Database Backup", schedule: "Daily at 2:00 AM", lastRun: "2024-10-27 02:00", status: "Completed" },
    { task: "Log Cleanup", schedule: "Weekly on Sunday", lastRun: "2024-10-20 03:00", status: "Completed" },
    { task: "Cache Clear", schedule: "Every 6 hours", lastRun: "2024-10-27 12:00", status: "Completed" },
    { task: "Security Scan", schedule: "Daily at 4:00 AM", lastRun: "2024-10-27 04:00", status: "Completed" },
  ];

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 space-y-10">
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
          {success}
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            System Maintenance
          </h1>
          <p className="text-gray-600 mt-1">Manage system updates and maintenance</p>
        </div>

        {/* APK Upload Form Modal Button */}
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload new APK file
            </button>
          </div>

      {/* APK Upload Modal */}
      {showUploadModal && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUploadModal(false);
          }}
        >
          {/* Glassmorphism Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-fadeIn" />

          <div 
            className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">Upload New APK</h3>
                  <p className="text-gray-500 text-sm">Deploy the latest version to users</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-all p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <form onSubmit={handleAPKUpload} className="p-8 space-y-8">
                {/* APK File Upload */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 ml-1">
                    <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    APK/IPA File
                  </label>
                  <div className="relative border-2 border-dashed border-gray-200 group-hover:border-indigo-400 rounded-2xl p-8 transition-all bg-gray-50/50 hover:bg-indigo-50/30 text-center">
                    <input
                      type="file"
                      accept=".apk,.ipa"
                      onChange={(e) => setApkFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-gray-900 font-semibold text-lg">
                        {apkFile ? apkFile.name : "Choose a file or drag & drop"}
                      </p>
                      <p className="text-gray-500 text-sm">Support .apk and .ipa files up to 100MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Version Number */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 ml-1">
                      <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
                        </svg>
                      </div>
                      APK File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400"
                      placeholder="e.g., 2.5.0"
                      required
                    />
                  </div>

                  {/* New Features */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 ml-1">
                      <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                        </svg>
                      </div>
                      New Features (comma separated) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 resize-none"
                      placeholder="Automatic transcripts, Multi-language support, etc."
                      rows="3"
                    />
                  </div>

                  {/* Improvements & Bug Fixes - Hidden for first upload */}
                  {recentUpdates && recentUpdates.length > 0 && (
                    <>
                      {/* Improvements */}
                      <div className="col-span-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 ml-1">
                          <div className="w-6 h-6 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          Improvements (comma separated)
                        </label>
                        <textarea
                          value={improvements}
                          onChange={(e) => setImprovements(e.target.value)}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 resize-none"
                          placeholder="Faster processing, UI polish, etc."
                          rows="3"
                        />
                      </div>

                      {/* Bug Fixes */}
                      <div className="col-span-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 ml-1">
                          <div className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          Bug Fixes (comma separated)
                        </label>
                        <textarea
                          value={bugFixes}
                          onChange={(e) => setBugFixes(e.target.value)}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400 resize-none"
                          placeholder="Fixed login crash, Corrected timezone display, etc."
                          rows="3"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_25px_rgba(79,70,229,0.4)] active:scale-95 flex items-center justify-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Release Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

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
            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex justify-between items-center transition-all hover:bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  Maintenance Mode
                </h3>
                <p className="text-xs text-gray-500 mt-1">Restrict user access during updates</p>
              </div>

              <button
                onClick={handleMaintenanceModeToggle}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${maintenanceMode ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <span className={`inline-block h-5 w-5 transform bg-white rounded-full transition-transform duration-300 shadow-sm
                  ${maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <hr className="border-gray-100" />

            {/* Backup Configuration Form */}
            <form onSubmit={handleBackupConfigUpdate} className="space-y-6">
              {/* Auto Backup Toggle */}
              <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    </div>
                    Daily Auto Backup
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Enable automated daily system backups</p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoBackupToggle}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${autoBackup ? "bg-indigo-600" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-5 w-5 transform bg-white rounded-full transition-transform duration-300 shadow-sm
                    ${autoBackup ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              {autoBackup ? (
                /* Auto Backup Time Input */
                <div className="animate-fadeIn">
                  <label className="text-sm font-bold text-gray-700 ml-1 mb-2 block lowercase first-letter:uppercase">
                    Backup Time (Daily)
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={backupConfig.backupTime}
                      onChange={(e) => setBackupConfigState({...backupConfig, backupTime: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                /* One-time Scheduled Backup Section */
                <div className="animate-fadeIn space-y-4 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox"
                      id="oneTimeBackup"
                      checked={backupConfig.oneTimeBackupEnabled}
                      onChange={(e) => setBackupConfigState({...backupConfig, oneTimeBackupEnabled: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="oneTimeBackup" className="text-sm font-bold text-gray-700 cursor-pointer">
                      Schedule a one-time backup
                    </label>
                  </div>

                  {backupConfig.oneTimeBackupEnabled && (
                    <div className="animate-fadeIn">
                      <label className="text-sm font-bold text-gray-700 ml-1 mb-2 block">
                        Target Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={backupConfig.oneTimeScheduledBackup}
                        onChange={(e) => setBackupConfigState({...backupConfig, oneTimeScheduledBackup: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        required={backupConfig.oneTimeBackupEnabled}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updatingConfig}
                  className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                >
                  {updatingConfig ? "Updating..." : "Save Configuration"}
                </button>
                <button
                  type="button"
                  onClick={handleTriggerBackup}
                  disabled={backupTriggering}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                >
                  {backupTriggering ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : "Create Backup Now"}
                </button>
              </div>
            </form>
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
                <p className="font-semibold">
                  {systemInfo.lastBackupDate ? (
                    new Date(systemInfo.lastBackupDate).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  ) : (
                    'No backups yet'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Scheduled Backup</p>
                <p className="font-semibold">
                  {systemInfo.nextScheduledBackup ? (
                    new Date(systemInfo.nextScheduledBackup).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  ) : (
                    'Not scheduled'
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Update History Full Width */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Update History</h2>

          {recentUpdates.length === 0 ? (
            <p className="text-gray-500">No updates available</p>
          ) : (
            recentUpdates.map((update, idx) => (
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
                    <div className="flex items-center gap-2">
                       <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        update.type === "Minor"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {update.type}
                      </span>
                      <button
                        onClick={() => handleDeleteVersion(update.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Version"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {update.features && update.features.length > 0 && (
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Features:</strong> {update.features.join(", ")}
                    </div>
                  )}
                  {update.improvements && update.improvements.length > 0 && (
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Improvements:</strong> {update.improvements.join(", ")}
                    </div>
                  )}
                  {update.bugFixes && update.bugFixes.length > 0 && (
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Bug Fixes:</strong> {update.bugFixes.join(", ")}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Backup History */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Backup History</h2>

          {backupHistory.length === 0 ? (
            <p className="text-gray-500">No backups available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Backup Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {backupHistory.map((backup, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-4">{new Date(backup.backupDate).toLocaleString()}</td>
                      <td className="py-3 px-4">{backup.backupSize}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          backup.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : backup.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

    </div>
  );
}

function ProtectedSystemMaintenance() {
  return (
    <ProtectedAdminRoute>
      <SystemMaintenance />
    </ProtectedAdminRoute>
  );
}

ProtectedSystemMaintenance.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProtectedSystemMaintenance;
