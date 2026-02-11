import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getAdminToken } from "@/lib/auth";
import { requireAdmin } from "@/lib/serverAuth";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function Notifications() {
  const [notificationType, setNotificationType] = useState("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [targetUserId, setTargetUserId] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [scheduleNow, setScheduleNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const [recipientCount, setRecipientCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  const fetchNotifications = async () => {
    const token = getAdminToken();
    if (!token) {
      setError("Admin token missing. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
    } catch (err) {
      const messageText = err?.response?.data?.message || "Failed to load notifications";
      setError(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    const token = getAdminToken();
    if (!token) {
      return;
    }

    setUsersLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAvailableUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setAvailableUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchRecipientCount = async (audience, userIds) => {
    const token = getAdminToken();
    if (!token) {
      return;
    }

    try {
      const params = new URLSearchParams({ audience });
      if (audience === "user" && userIds && userIds.length > 0) {
        params.set("targetUserIds", userIds.join(","));
      }

      const { data } = await axios.get(`${API_URL}/api/notifications/recipients?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipientCount(Number.isFinite(data?.count) ? data.count : 0);
    } catch (err) {
      setRecipientCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (targetAudience === "user") {
      fetchAvailableUsers();
    }
  }, [targetAudience]);

  useEffect(() => {
    if (targetAudience === "user") {
      if (selectedUserIds.length === 0) {
        setRecipientCount(0);
        return;
      }
      fetchRecipientCount(targetAudience, selectedUserIds);
    } else {
      fetchRecipientCount(targetAudience, []);
    }
  }, [targetAudience, selectedUserIds]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendError("");
    setSuccessMessage("");

    const token = getAdminToken();
    if (!token) {
      setSendError("Admin token missing. Please login again.");
      setIsSending(false);
      return;
    }

    const payload = {
      title,
      message,
      type: notificationType,
      audience: targetAudience,
      targetUserIds: targetAudience === "user" ? selectedUserIds : undefined,
    };

    if (targetAudience === "user" && selectedUserIds.length === 0) {
      setSendError("Please select at least one user.");
      setIsSending(false);
      return;
    }

    if (!scheduleNow) {
      if (!scheduledDate || !scheduledTime) {
        setSendError("Please select a date and time.");
        setIsSending(false);
        return;
      }
      payload.scheduledAt = `${scheduledDate}T${scheduledTime}`;
    }

    try {
      const audienceLabel = (() => {
        switch (targetAudience) {
          case "all":
            return "all users";
          case "students":
            return "students";
          case "teachers":
            return "teachers";
          case "user":
            return `${selectedUserIds.length} selected user${selectedUserIds.length === 1 ? "" : "s"}`;
          default:
            return targetAudience;
        }
      })();

      const { data } = await axios.post(`${API_URL}/api/notifications`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const statusMessage =
        data?.status === "scheduled"
          ? "Notification scheduled successfully."
          : "Notification sent successfully.";

      setShowSuccess(true);
      setSuccessMessage(statusMessage);
      toast.success(`${statusMessage} (${audienceLabel})`);

      setTitle("");
      setMessage("");
      setNotificationType("info");
      setTargetAudience("all");
      setTargetUserId("");
      setSelectedUserIds([]);
      setScheduleNow(true);
      setScheduledDate("");
      setScheduledTime("");

      fetchNotifications();

      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      const messageText = err?.response?.data?.message || "Failed to send notification";
      setSendError(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "alert":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success": return { bg: "bg-green-100", text: "text-green-700", icon: "text-green-600" };
      case "warning": return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-600" };
      case "alert": return { bg: "bg-red-100", text: "text-red-700", icon: "text-red-600" };
      default: return { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-600" };
    }
  };

  return (
      <div className="px-4 sm:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Send Notifications</h1>
            <p className="text-gray-600 mt-1">Broadcast messages to users about updates and changes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Recipients</p>
              <p className="text-2xl font-bold text-indigo-600">{recipientCount}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between animate-fade-in gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-900">Notification Updated!</p>
                  <p className="text-sm text-green-700">{successMessage || "Your notification was processed."}</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-700 self-start sm:self-auto">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {sendError ? (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              {sendError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Notification Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Notification</h2>
                
                <form onSubmit={handleSendNotification} className="space-y-6">
                  {/* Notification Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Notification Type
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { value: "info", label: "Info", color: "blue" },
                        { value: "success", label: "Success", color: "green" },
                        { value: "warning", label: "Warning", color: "yellow" },
                        { value: "alert", label: "Alert", color: "red" }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setNotificationType(type.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            notificationType === type.value
                              ? `border-${type.color}-500 bg-${type.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                            notificationType === type.value 
                              ? `bg-${type.color}-100 text-${type.color}-600`
                              : "bg-gray-100 text-gray-400"
                          }`}>
                            {getTypeIcon(type.value)}
                          </div>
                          <p className={`text-sm font-semibold ${
                            notificationType === type.value ? "text-gray-900" : "text-gray-600"
                          }`}>
                            {type.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                      Notification Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      placeholder="Enter notification title..."
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                      placeholder="Write your notification message here..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">{message.length} / 500 characters</p>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label htmlFor="audience" className="block text-sm font-semibold text-gray-900 mb-2">
                      Target Audience
                    </label>
                    <select
                      id="audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="teachers">Teachers Only</option>
                      <option value="user">Specific User</option>
                    </select>
                    {targetAudience === "user" && (
                      <div className="mt-3 border-2 border-gray-200 rounded-xl p-4 max-h-96 overflow-y-auto">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Select Users (Multiple)</p>
                        {usersLoading ? (
                          <p className="text-sm text-gray-600">Loading users...</p>
                        ) : availableUsers.length === 0 ? (
                          <p className="text-sm text-gray-600">No users available</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedUserIds.length === availableUsers.length && availableUsers.length > 0}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedUserIds(availableUsers.map((u) => u.id));
                                      } else {
                                        setSelectedUserIds([]);
                                      }
                                    }}
                                    className="rounded"
                                  />
                                </th>
                                <th className="text-left py-2 px-2">Name</th>
                                <th className="text-left py-2 px-2">Email</th>
                                <th className="text-left py-2 px-2">Role</th>
                              </tr>
                            </thead>
                            <tbody>
                              {availableUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-2 px-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedUserIds.includes(user.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedUserIds([...selectedUserIds, user.id]);
                                        } else {
                                          setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
                                        }
                                      }}
                                      className="rounded"
                                    />
                                  </td>
                                  <td className="py-2 px-2 text-gray-900">{user.name}</td>
                                  <td className="py-2 px-2 text-gray-600">{user.email}</td>
                                  <td className="py-2 px-2">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                      user.role === "Student" ? "bg-green-100 text-green-700" :
                                      user.role === "Teacher" ? "bg-purple-100 text-purple-700" :
                                      "bg-orange-100 text-orange-700"
                                    }`}>
                                      {user.role}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                        <p className="text-xs text-gray-600 mt-3">
                          {selectedUserIds.length} of {availableUsers.length} user(s) selected
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Schedule Options */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Send Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="radio"
                          name="schedule"
                          checked={scheduleNow}
                          onChange={() => setScheduleNow(true)}
                          className="w-5 h-5 text-indigo-600"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">Send Immediately</p>
                          <p className="text-sm text-gray-600">Notification will be sent right away</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="radio"
                          name="schedule"
                          checked={!scheduleNow}
                          onChange={() => setScheduleNow(false)}
                          className="w-5 h-5 text-indigo-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Schedule for Later</p>
                          <p className="text-sm text-gray-600 mb-3">Choose a specific date and time</p>
                          {!scheduleNow && (
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 outline-none"
                                required={!scheduleNow}
                              />
                              <input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 outline-none"
                                required={!scheduleNow}
                              />
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          {scheduleNow ? "Send Notification" : "Schedule Notification"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle("");
                        setMessage("");
                        setNotificationType("info");
                        setTargetAudience("all");
                        setTargetUserId("");
                        setSelectedUserIds([]);
                        setScheduleNow(true);
                        setScheduledDate("");
                        setScheduledTime("");
                      }}
                      className="w-full sm:w-auto px-6 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Preview & Stats */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
                <div className={`p-4 rounded-xl border-2 ${getTypeColor(notificationType).bg} border-${notificationType === 'success' ? 'green' : notificationType === 'warning' ? 'yellow' : notificationType === 'alert' ? 'red' : 'blue'}-200`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notificationType === 'success' ? 'bg-green-100' : notificationType === 'warning' ? 'bg-yellow-100' : notificationType === 'alert' ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {getTypeIcon(notificationType)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{title || "Notification Title"}</p>
                      <p className="text-gray-600 mt-1">{message || "This is a preview of your notification message."}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification History */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notification History</h3>
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-gray-600 font-semibold">Title</th>
                      <th className="px-4 py-2 text-gray-600 font-semibold">Audience</th>
                      <th className="px-4 py-2 text-gray-600 font-semibold">Sent By</th>
                      <th className="px-4 py-2 text-gray-600 font-semibold">Date</th>
                      <th className="px-4 py-2 text-gray-600 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td className="px-4 py-3 text-gray-600" colSpan={5}>
                          Loading notifications...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td className="px-4 py-3 text-red-600" colSpan={5}>
                          {error}
                        </td>
                      </tr>
                    ) : notifications.length === 0 ? (
                      <tr>
                        <td className="px-4 py-3 text-gray-600" colSpan={5}>
                          No notifications yet.
                        </td>
                      </tr>
                    ) : (
                      notifications.map((notif) => (
                        <tr key={notif.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 max-w-xs truncate">{notif.title}</td>
                          <td className="px-4 py-2">{notif.audienceLabel || notif.audience}</td>
                          <td className="px-4 py-2">{notif.sentBy}</td>
                          <td className="px-4 py-2">{formatDateTime(notif.sentDate)}</td>
                          <td className="px-4 py-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(notif.type).bg} ${getTypeColor(notif.type).text}`}>
                              {notif.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}

Notifications.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Notifications;

export const getServerSideProps = requireAdmin;
