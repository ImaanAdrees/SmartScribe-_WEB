"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import Image from "next/image";


function AdminProfile() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@example.com",
    image: "https://via.placeholder.com/150"
  });

  const [editable, setEditable] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl });
    }
  };

  const handleSave = () => {
    setEditable(false);
    console.log("Saved user", user);
  };

const handleLogout = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/admin/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // Remove token from storage
    localStorage.removeItem("adminToken");

    // Redirect to login
    router.push("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error.message);

    // Force logout anyway (failsafe)
    localStorage.removeItem("adminToken");
    router.push("/auth/login");
  }
};


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 w-full max-w-md text-center">

        {/* Hidden file input */}
        <input
          type="file"
          id="uploadImage"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Clickable Profile Image */}
        <label htmlFor="uploadImage" className="cursor-pointer inline-block">
          <Image
          width={112}
          height={112}
            src={user.image}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto border-4 border-indigo-600 shadow-md hover:opacity-80 transition"
          />
          <p className="text-xs text-indigo-600 mt-1 hover:underline">
            Change Profile Photo
          </p>
        </label>

        {/* Editable Fields */}
        <div className="mt-6 text-left">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            disabled={!editable}
            className="mt-1 w-full p-3 border rounded-xl bg-gray-50 focus:outline-none"
            value={user.name}
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
          />

          <label className="text-sm font-medium text-gray-700 mt-4 block">
            Email
          </label>
          <input
            type="email"
            disabled={!editable}
            className="mt-1 w-full p-3 border rounded-xl bg-gray-50 focus:outline-none"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />
        </div>

        {/* Buttons Section */}
        <div className="border-t border-gray-200 my-6"></div>

        {!editable ? (
          <button
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all mb-3"
            onClick={() => setEditable(true)}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all mb-3"
            onClick={handleSave}
          >
            Save Changes
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
        >
          Logout
        </button>

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
