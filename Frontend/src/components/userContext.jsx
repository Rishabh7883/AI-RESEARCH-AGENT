import React, { createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Provider to wrap your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = { fullname, email, ... }

  const login = (userData) => {
    setUser(userData);  
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
