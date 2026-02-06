import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAdminContext } from "@/context/AdminContext";

// =====================
// Icon Components
// =====================
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UserManagementIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const NotificationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// =====================
// Main Component
// =====================
export default function AdminSidebar({ onClose }) {
  const router = useRouter();
  const { adminProfile } = useAdminContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // =====================
  // Effects
  // =====================
  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsCollapsed(false); // Always show full width on mobile
      } else {
        setIsMobile(false);
        setIsCollapsed(false);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // =====================
  // Menu Configuration
  // =====================
  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <DashboardIcon />
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: <UserManagementIcon />
    },
    {
      name: "System Analytics",
      href: "/admin/analytics",
      icon: <AnalyticsIcon />
    },
    {
      name: "Send Notifications",
      href: "/admin/notifications",
      icon: <NotificationIcon />
    },
    {
      name: "System Maintenance",
      href: "/admin/maintenance",
      icon: <MaintenanceIcon />
    },
  ];

  // =====================
  // Render
  // =====================
  return (
    <>
      {/* ========== MAIN SIDEBAR ========== */}
      <div
        className={`
          ${isCollapsed ? "w-20" : "w-64"}
          bg-white border-r border-gray-200 min-h-screen flex flex-col
          transition-all duration-300 z-50
        `}
      >
        {/* ========== HEADER SECTION ========== */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <Image 
            src="/mainlogo.png" 
            width={40} 
            height={40} 
            alt="SmartScribe Logo" 
            className="rounded-lg" 
          />
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="font-bold text-gray-900 text-lg">SmartScribe</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => onClose && onClose()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ========== COLLAPSE BUTTON ========== */}
        {!isMobile && (
          <div className="px-4 py-3 flex justify-end border-b border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-10 h-10 bg-indigo-600 rounded-full 
                flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* ========== NAVIGATION MENU ========== */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => onClose && onClose()}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl 
                      transition-all duration-200 
                      ${isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } 
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    title={isCollapsed ? item.name : ""}
                  >
                    <span className={isActive ? "text-indigo-600" : ""}>{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ========== FOOTER SECTION (Profile & Logout) ========== */}
        <div className="p-4 border-t border-gray-200">
          {/* Profile Card */}
          <Link
            href="/admin/profile"
            onClick={() => onClose && onClose()}
            className={`
              flex items-center gap-3 p-3 rounded-xl 
              hover:bg-gray-50 transition-colors cursor-pointer
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            {adminProfile.image ? (
              <Image
                src={adminProfile.image}
                alt={adminProfile.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {adminProfile.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {adminProfile.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{adminProfile.email}</p>
              </div>
            )}
          </Link>

          {/* Logout Button */}
          <Link
            href="/auth/login"
            onClick={() => {
              localStorage.removeItem("adminToken");
              onClose && onClose();
            }}
            className={`
              mt-2 flex items-center gap-2 px-4 py-2 text-sm 
              text-gray-600 hover:text-red-600 hover:bg-red-50 
              rounded-lg transition-colors
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </>
  );
}