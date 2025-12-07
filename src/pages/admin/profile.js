"use client";
import { useState } from "react";

export default function AdminProfile() {
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

  const handleLogout = () => {
    console.log("Logged Out");
    // Add actual logout logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
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
          <img
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
