import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/iocns/thrive-icon-cropped.png";
import { GoHomeFill } from "react-icons/go";
import { RiContactsFill, RiMessage2Fill, RiVideoUploadFill } from "react-icons/ri";
import { IoCall, IoSettingsSharp } from "react-icons/io5";
import { MdVideoCall } from "react-icons/md";
import { AiFillSchedule } from "react-icons/ai";

const NavSidebar: React.FC = () => {
  return (
    <>
      <div className="bg--400 w-16 h-screen flex flex-col justify-center items-center shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
        <div className=" h-[10%] w-14 flex flex-col justify-center items-center">
          <Link to="/">
            <div
              className="w-11 h-11 bg-contain  "
              style={{ backgroundImage: `url(${logo})` }}
            ></div>
          </Link>
        </div>
        <div className=" h-[90%] w-14 flex justify-center items-center">
          <ul className="gap-6 flex flex-col">
            <li className="w-11 h-11 bg-contain flex justify-center items-center "><GoHomeFill  color="#36454F" size={20} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><RiMessage2Fill color="#36454F" size={20} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><IoCall color="#36454F" size={20} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><MdVideoCall color="#36454F" size={25} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><RiContactsFill color="#36454F" size={20} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><RiVideoUploadFill color="#36454F" size={20} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><AiFillSchedule color="#36454F" size={20} /></li>
            <li className="w-11 h-11 bg-contain flex justify-center items-center"><IoSettingsSharp color="#36454F" size={20} /></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;
