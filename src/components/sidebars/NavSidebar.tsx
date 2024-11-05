import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/iocns/thrive-icon-cropped.png"; 
import {
  CalendarRange,
  Gem,
  LayoutDashboard,
  ListTodo,
  MessagesSquare,
  Phone,
  Settings,
  Video,
} from "lucide-react";
import { FaBlog } from "react-icons/fa6";

const NavSidebar: React.FC = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("");

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    setIsDarkMode(darkMode === "true");

    const savedIcon = localStorage.getItem("selectedIcon");
    if (savedIcon) {
      setSelectedIcon(savedIcon);
    }
  }, []);

  useEffect(() => {
    const mainPath = location.pathname.split("/").filter(Boolean)[0]; 
  
    if (mainPath) { 
      setSelectedIcon(mainPath);
      localStorage.setItem("selectedIcon", mainPath);
    }
  }, [location.pathname]);
  
  

  const iconColor = (iconName: string) =>
    selectedIcon === iconName ? "#318CE7" : isDarkMode ? "#989898" : "#505050";

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    localStorage.setItem("selectedIcon", iconName);
  };

  return (
    <div className="dark:bg-dark-bg w-16 h-screen flex flex-col justify-center items-center shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
      <div className="h-[10%] w-14 flex flex-col justify-center items-center">
        <Link to="/">
          <div
            className="w-11 h-11 bg-contain hover:cursor-pointer"
            style={{ backgroundImage: `url(${logo})` }}
          ></div>
        </Link>
      </div>
      <div className="h-[90%] w-14 flex justify-center items-center">
        <ul className="gap-6 flex flex-col">
          <Link to="/home">
            <li
              onClick={() => handleIconClick("home")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <LayoutDashboard color={iconColor("home")} size={23} />
            </li>
          </Link>
          <Link to="/chat">
            <li
              onClick={() => handleIconClick("chat")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <MessagesSquare color={iconColor("chat")} size={23} />
            </li>
          </Link>
          <Link to="/audio-call">
            <li
              onClick={() => handleIconClick("audio-call")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <Phone color={iconColor("audio-call")} size={23} />
            </li>
          </Link>
          <Link to="/video-call">
            <li
              onClick={() => handleIconClick("video-call")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <Video color={iconColor("video-call")} size={25} />
            </li>
          </Link>
          <Link to="/event">
            <li
              onClick={() => handleIconClick("event")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <CalendarRange color={iconColor("event")} size={23} />
            </li>
          </Link>
          <Link to="/tasks">
            <li
              onClick={() => handleIconClick("tasks")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <ListTodo color={iconColor("tasks")} size={25} />
            </li>
          </Link>
          <Link to="/blog">
            <li
              onClick={() => handleIconClick("blog")}
              className="w-11 h-11 bg-contain flex justify-center items-center relative group"
            >
              <FaBlog color={iconColor("blog")} size={21} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-full ml-2 bg-gray-500 text-white text-xs rounded py-1 px-2">
                hello
              </span>
            </li>
          </Link>
          <Link to="/payment-start">
            <li
              onClick={() => handleIconClick("unlock")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <Gem color={iconColor("unlock")} size={23} />
            </li>
          </Link>
          <Link to="/profile">
            <li
              onClick={() => handleIconClick("settings")}
              className="w-11 h-11 bg-contain flex justify-center items-center"
            >
              <Settings color={iconColor("settings")} size={23} />
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default NavSidebar;
