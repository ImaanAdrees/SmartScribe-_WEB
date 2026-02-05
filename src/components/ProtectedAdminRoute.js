import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyAdminToken } from "@/lib/auth";

/**
 * Higher-Order Component to protect admin routes
 * Checks if user has valid admin token before rendering the page
 */
export default function ProtectedAdminRoute({ children }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { valid } = await verifyAdminToken();
        
        if (valid) {
          setIsAuthorized(true);
        } else {
          // Not authorized, redirect to login
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        router.replace("/auth/login");
      } finally {
        setIsVerifying(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? children : null;
}
