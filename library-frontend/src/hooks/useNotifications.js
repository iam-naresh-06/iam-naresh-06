import { useContext, useEffect } from "react";
import NotificationContext from "../context/NotificationContext";
import * as notificationService from "../services/notificationService";

// Custom hook for notifications
export default function useNotifications() {
  const { notifications, addNotification, removeNotification, clearAll } =
    useContext(NotificationContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getAllNotifications();
        response.data.forEach((n) => addNotification(n));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [addNotification]);

  return { notifications, addNotification, removeNotification, clearAll };
}
