import { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin",
    email: "admin@smartscribe.com",
    image: null,
  });

  const updateAdminProfile = useCallback((profile) => {
    setAdminProfile(profile);
  }, []);

  const value = {
    adminProfile,
    updateAdminProfile,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};
