import { useSocket } from "@/contexts/SocketContext";
import { Bell } from "lucide-react";
import React, { useState } from "react";

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notificationSocketService } = useSocket();
  const h=5;

  notificationSocketService?.emit("text",{h})

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Bell
        className="dark:text-white cursor-pointer"
        size={25}
        onClick={toggleDropdown}
      />
      
      {/* Notification dropdown */}
      <div
        className={`fixed top-16 right-4 w-[400px] max-h-[700px] bg-white dark:bg-neutral-800 shadow-[0px_0px_42px_11px_#00000024]  rounded-lg transform transition-transform duration-200 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Notifications</h2>
        </div>
        <div  className="flex flex-col h-[500px] ">
        <div className="p-4 space-y-4 overflow-y-auto h-full scrollbar-custom">
          {/* Sample notifications */}
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">You have a new message from John Doe.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">5 mins ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Your meeting is scheduled for tomorrow.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">1 hour ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-700 rounded-md p-3">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">New comment on your post.</p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">2 days ago</span>
          </div>
          {/* Add more sample notifications as needed */}
        </div>
        </div>
        <p className="dark:text-neutral-400 cursor-pointer pl-3 mb-2  border-t border-neutral-200 dark:border-neutral-700" >clear</p>
      </div>
    </div>
  );
};

export default Notification;
