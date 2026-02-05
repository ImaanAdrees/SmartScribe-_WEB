import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

// =====================
// Icon Components
// =====================
const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UserManagementIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const NotificationIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// =====================
// Main Component
// =====================
export default function MobileNavBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // =====================
  // Navigation Items
  // =====================
  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <DashboardIcon />
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <UserManagementIcon />
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <AnalyticsIcon />
    },
    {
      name: "Notify",
      href: "/admin/notifications",
      icon: <NotificationIcon />
    },
    {
      name: "Maintain",
      href: "/admin/maintenance",
      icon: <MaintenanceIcon />
    },
  ];

  return (
    <>
      {/* ========== MOBILE HEADER WITH HAMBURGER ========== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ========== MOBILE MENU DROPDOWN ========== */}
      {isOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 bg-white border-b border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="flex flex-col py-3">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-6 py-3
                    transition-all duration-200 border-l-4
                    ${isActive
                      ? "text-indigo-600 bg-indigo-50 border-l-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 border-l-transparent"
                    }
                  `}
                >
                  <span className={isActive ? "text-indigo-600" : ""}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== SPACER FOR MOBILE HEADER ========== */}
      <div className="lg:hidden h-14" />

      {/* ========== MOBILE BOTTOM NAVIGATION ========== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-3">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
                  }
                `}
              >
                <span className={isActive ? "text-indigo-600" : ""}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ========== SPACER FOR BOTTOM NAV ========== */}
      <div className="lg:hidden h-20" />
    </>
  );
}
