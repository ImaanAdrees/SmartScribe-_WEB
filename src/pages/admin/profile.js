"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function AdminProfile() {
  const router = useRouter();
  const [tabActive, setTabActive] = useState("profile"); // profile or password
  
  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: null,
  });

  const [editableProfile, setEditableProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Fetch admin profile on mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/api/auth/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.admin) {
        setProfile({
          name: response.data.admin.name,
          email: response.data.admin.email,
          image: response.data.admin.image,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${API_URL}/api/auth/admin/profile/update`,
        {
          name: profile.name,
          image: profile.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("✓ Profile updated successfully!");
        setEditableProfile(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${API_URL}/api/auth/admin/profile/change-password`,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("✓ Password changed successfully!");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(
        `${API_URL}/api/auth/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      localStorage.removeItem("adminToken");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      localStorage.removeItem("adminToken");
      router.push("/auth/login");
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile and security settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setTabActive("profile")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              tabActive === "profile"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setTabActive("password")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              tabActive === "password"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Profile Tab */}
        {tabActive === "profile" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">

            {/* Profile Image */}
            <div className="text-center mb-8">
              <input
                type="file"
                id="uploadImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={!editableProfile}
              />

              <label
                htmlFor="uploadImage"
                className={`cursor-pointer inline-block ${
                  !editableProfile ? "cursor-not-allowed opacity-75" : ""
                }`}
              >
                <div className="relative w-28 h-28 mx-auto mb-3">
                  <Image
                    src={profile.image || "/mainlogo.png"}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-full border-4 border-indigo-600 shadow-md object-cover mx-auto"
                  />
                </div>
                {editableProfile && (
                  <p className="text-xs text-indigo-600 hover:underline">
                    Change Profile Photo
                  </p>
                )}
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  disabled={!editableProfile}
                  className={`w-full p-3 border rounded-lg transition-colors ${
                    editableProfile
                      ? "border-gray-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Email <span className="text-gray-500">(Read-only)</span>
                </label>
                <input
                  type="email"
                  disabled
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  value={profile.email}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {!editableProfile ? (
                <button
                  onClick={() => setEditableProfile(true)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleProfileSave}
                    disabled={profileLoading}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditableProfile(false);
                      fetchAdminProfile();
                    }}
                    className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Password Tab */}
        {tabActive === "password" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 pr-10"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, old: !showPasswords.old })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPasswords.old ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 pr-10"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPasswords.new ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 pr-10"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPasswords.confirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 mt-6"
              >
                {passwordLoading ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedAdminProfile() {
  return (
    <ProtectedAdminRoute>
      <AdminProfile />
    </ProtectedAdminRoute>
  );
}

ProtectedAdminProfile.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProtectedAdminProfile;
