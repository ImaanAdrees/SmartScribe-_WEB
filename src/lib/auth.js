import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Get admin token from localStorage
 */
export const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};

/**
 * Set admin token to localStorage
 */
export const setAdminToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token);
  }
};

/**
 * Remove admin token from localStorage
 */
export const removeAdminToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpiry");
  }
};

/**
 * Set token expiry time
 */
export const setTokenExpiry = (expiresAt) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminTokenExpiry", expiresAt);
  }
};

/**
 * Check if token is expired or about to expire (within 5 minutes)
 */
export const isTokenExpiringSoon = () => {
  if (typeof window !== "undefined") {
    const expiryTime = localStorage.getItem("adminTokenExpiry");
    if (!expiryTime) return true;
    
    const timeUntilExpiry = new Date(expiryTime) - new Date();
    // Return true if less than 5 minutes until expiry
    return timeUntilExpiry < 5 * 60 * 1000;
  }
  return true;
};

/**
 * Refresh admin token
 */
export const refreshAdminToken = async () => {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error("No token to refresh");
  }

  try {
    const { data } = await axios.post(
      `${API_URL}/api/auth/admin/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAdminToken(data.token);
    setTokenExpiry(data.expiresAt);
    
    return data;
  } catch (error) {
    removeAdminToken();
    throw error;
  }
};

/**
 * Check if admin is authenticated by verifying token with backend
 */
export const verifyAdminToken = async () => {
  const token = getAdminToken();
  
  if (!token) {
    return { valid: false, admin: null };
  }

  // Check if token is expiring soon and refresh if needed
  if (isTokenExpiringSoon()) {
    try {
      await refreshAdminToken();
    } catch (error) {
      console.error("Token refresh failed:", error);
      removeAdminToken();
      return { valid: false, admin: null };
    }
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/auth/admin/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update token expiry
    if (data.sessionExpiresAt) {
      setTokenExpiry(data.sessionExpiresAt);
    }

    return { valid: data.valid, admin: data.admin };
  } catch (error) {
    // Token is invalid or expired
    removeAdminToken();
    return { valid: false, admin: null };
  }
};

/**
 * Logout admin
 */
export const logoutAdmin = async () => {
  const token = getAdminToken();
  
  if (token) {
    try {
      await axios.post(
        `${API_URL}/api/auth/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  
  removeAdminToken();
  
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
};

/**
 * Check if user is authenticated (for client-side only)
 */
export const isAuthenticated = () => {
  return !!getAdminToken();
};

/**
 * Get admin profile (name, email, image)
 */
export const getAdminProfile = async () => {
  const token = getAdminToken();
  
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/auth/admin/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.admin;
  } catch (error) {
    console.error("Get admin profile error:", error);
    throw error;
  }
};
