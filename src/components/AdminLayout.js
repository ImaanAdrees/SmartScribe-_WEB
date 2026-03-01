import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { useAdminContext } from "@/context/AdminContext";
import { getAdminProfile, getAdminToken } from "@/lib/auth";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { updateAdminProfile } = useAdminContext();

  // Initialize admin profile on mount
  useEffect(() => {
    const initializeAdminProfile = async () => {
      try {
        const token = getAdminToken();
        if (!token) {
          return;
        }
        const profile = await getAdminProfile();
        updateAdminProfile({
          name: profile.name || "Admin",
          email: profile.email || "admin@smartscribe.com",
          image: profile.image || null,
        });
      } catch (error) {
        console.error("Failed to initialize admin profile:", error);
      }
    };

    initializeAdminProfile();
  }, [updateAdminProfile]);

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const sidebarClassName = [
    isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : "relative",
    isMobile && !mobileMenuOpen ? "-translate-x-full" : "translate-x-0",
    "transition-transform duration-300 ease-in-out",
  ].join(" ");

  return (
    <ProtectedAdminRoute>
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
        {/* Mobile Overlay */}
        {isMobile && mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className={sidebarClassName}>
          {/* Sidebar */}
          <div className="h-full">
            <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-w-0 max-w-full flex-col min-h-screen w-full lg:w-auto overflow-x-hidden">
          {/* Navbar */}
          <AdminNavbar onMenuToggle={handleMenuToggle} />

          {/* Page Content */}
          <main className="flex-1 min-w-0 max-w-full overflow-x-hidden">{children}</main>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
