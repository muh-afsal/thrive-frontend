import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/iocns/thrive-icon-cropped.png";
import { GoHomeFill } from "react-icons/go";
import { RiContactsFill, RiMessage2Fill, RiVideoUploadFill } from "react-icons/ri";
import { IoCall, IoSettingsSharp } from "react-icons/io5";
import { MdVideoCall } from "react-icons/md";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { AiFillSchedule } from "react-icons/ai";

const NavSidebar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    setIsDarkMode(darkMode === "true");
  }, []);

  const iconColor = isDarkMode ? "#939393  " : "#505050 ";

  return (
    <>
      <div className=" dark:bg-dark-bg  w-16 h-screen flex flex-col justify-center items-center shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
        <div className=" h-[10%] w-14 flex flex-col justify-center items-center">
          <Link to="/">
            <div
              className="w-11 h-11 bg-contain hover:cursor-pointer"
              style={{ backgroundImage: `url(${logo})` }}
            ></div>
          </Link>
        </div>
        <div className=" h-[90%] w-14 flex justify-center items-center">
          <ul className="gap-6 flex flex-col ">
            <Link to="/home">
              <li className="w-11 h-11 bg-contain flex justify-center items-center ">
                <GoHomeFill color={iconColor} size={20} />
              </li>
            </Link>
            <Link to="/chat">
              <li className="w-11 h-11 bg-contain flex justify-center items-center">
                <RiMessage2Fill color={iconColor} size={20} />
              </li>
            </Link>
            <Link to="/audio-call">
            <li className="w-11 h-11 bg-contain flex justify-center items-center">
              <IoCall color={iconColor} size={20} />
            </li>
            </Link>
            <li className="w-11 h-11 bg-contain flex justify-center items-center">
              <MdVideoCall color={iconColor} size={25} />
            </li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center">
              <RiContactsFill color={iconColor} size={20} />
            </li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center">
              <RiVideoUploadFill color={iconColor} size={20} />
            </li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center">
              <AiFillSchedule color={iconColor} size={20} />
            </li>
            <Link to="/payment-start">
              <li className="w-11 h-11 bg-contain flex justify-center items-center">
                <FaUnlockKeyhole color={iconColor} size={20} />
              </li>
            </Link>
            <Link to="/profile">
              <li className="w-11 h-11 bg-contain flex justify-center items-center">
                <IoSettingsSharp color={iconColor} size={20} />
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
