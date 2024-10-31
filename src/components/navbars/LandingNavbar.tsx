import { Link } from "react-router-dom";
import Ligntlogo from "@/assets/iocns/thrive-logo-light.svg";
import DarkLogo from "@/assets/iocns/thrive-logo-light.svg";
import { useEffect, useState } from "react";
// import ThemeToggle from "../common/DarkLightModeToggle";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "true");
  }, []);

  return (
    <div className="bg-transparent bg--400 ">
      <div className="flex justify-around items-center mx-auto p-3 bg-transparent">
        <div className="flex justify-between items-center bg-transparent dark:pt-1">
          <Link to="/">
            <img src={darkMode ? DarkLogo : Ligntlogo} className="object-contain   w-fit h-8 mr-14 " alt="logo" />
          </Link>

          <ul className="flex justify-between gap-9 items-start text-sm bg-transparent ">
            <Link to="/">
              <li className="text-slate-500 rounded-md px-3 py-1 dark:text-white font-semibold bg-transparent">
                Home
              </li>
            </Link>
            <Link to="/contact">
              <li className="text-slate-500 rounded-md px-3 py-1 dark:text-white font-semibold bg-transparent">
                Contact
              </li>
            </Link>
            <Link to="/about">
              <li className="text-slate-500 rounded-md px-3 mr-7 py-1 dark:text-white font-semibold bg-transparent">
                About
              </li>
            </Link>

          </ul>
          {/* <ThemeToggle /> */}
        </div>
        {/* <Link to="/signup">
          <button className="bg-blue-600 text-slate-50 rounded-md  px-3 py-1 font-semibold">
            Sign up for Free...
          </button>
        </Link> */}
      </div>
    </div>
  );
}
