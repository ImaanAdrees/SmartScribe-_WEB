import "@/styles/globals.css";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AdminProvider } from "@/context/AdminContext";
import { getSocket, initializeSocket } from "@/lib/socket";

export default function App({ Component, pageProps }) {
  const [maintenanceCountdown, setMaintenanceCountdown] = useState(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "System maintenance starting soon.",
  );
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const clearCountdown = () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setMaintenanceCountdown(null);
    };

    const startCountdown = (duration, message) => {
      const seconds = Number(duration);
      const safeDuration = Number.isFinite(seconds) && seconds > 0 ? seconds : 30;

      clearCountdown();
      setMaintenanceMessage(message || "System maintenance starting soon.");
      setMaintenanceCountdown(safeDuration);

      countdownIntervalRef.current = setInterval(() => {
        setMaintenanceCountdown((previous) => {
          if (!previous || previous <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return null;
          }
          return previous - 1;
        });
      }, 1000);
    };

    let socket = getSocket();
    if (!socket) {
      socket = initializeSocket();
    }

    const handleMaintenanceWarning = (payload = {}) => {
      startCountdown(payload.duration, payload.message);
    };

    const handleMaintenanceWarningCleared = () => {
      clearCountdown();
    };

    const handleMaintenanceModeChanged = (payload = {}) => {
      if (!payload.maintenanceMode) {
        clearCountdown();
      }
    };

    if (socket) {
      socket.on("maintenance_warning", handleMaintenanceWarning);
      socket.on("maintenance_warning_cleared", handleMaintenanceWarningCleared);
      socket.on("maintenance_mode_changed", handleMaintenanceModeChanged);
    }

    return () => {
      clearCountdown();
      if (socket) {
        socket.off("maintenance_warning", handleMaintenanceWarning);
        socket.off("maintenance_warning_cleared", handleMaintenanceWarningCleared);
        socket.off("maintenance_mode_changed", handleMaintenanceModeChanged);
      }
    };
  }, []);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AdminProvider>
      <>
        <Head>
          <title>SmartScribe</title>
        </Head>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
            },
            success: {
              style: {
                background: "#10b981",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
          }}
        />
        {maintenanceCountdown !== null && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 shadow-md">
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 text-sm sm:text-base font-semibold">
              <span>{maintenanceMessage}</span>
              <span>{maintenanceCountdown}s</span>
            </div>
          </div>
        )}
        {getLayout(<Component {...pageProps} />)}
      </>
    </AdminProvider>
  );
}
