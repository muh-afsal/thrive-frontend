import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { formatDistanceToNow } from "date-fns"; 
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CLIENT_API } from "@/axios"; 

interface NotificationData {
  message: string;
  createdAt: string;
}

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data } = useSelector((state: RootState) => state.user);
  const currentUserId = data?._id;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response=await CLIENT_API.get(`/notification/get-notification/${currentUserId}`);
        setNotifications(response.data.notifications); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <Bell
        className="dark:text-white cursor-pointer"
        size={25}
        onClick={toggleDropdown}
      />

      <div
        className={`fixed top-16 right-4 w-[400px] max-h-[700px] bg-white dark:bg-neutral-800 shadow-[0px_0px_42px_11px_#00000024] rounded-lg transform transition-transform duration-200 ease-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">
            Notifications
          </h2>
        </div>
        <div className="flex flex-col h-[500px]">
          <div className="p-4 space-y-4 overflow-y-auto h-full scrollbar-custom">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <PulseLoader color="#4A90E2" size={10} />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {notification.message}
                  </p>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(notification.createdAt))} ago
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                No notifications found.
              </p>
            )}
          </div>
        </div>
        <p
          className="dark:text-neutral-400 cursor-pointer pl-3 mb-2 border-t border-neutral-200 dark:border-neutral-700"
          onClick={() => setNotifications([])} 
        >
          Clear
        </p>
      </div>
    </div>
  );
};

export default Notification;
