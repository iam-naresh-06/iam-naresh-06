// src/context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setUnreadCount(0);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
