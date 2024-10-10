import { Link, useLocation } from "react-router-dom";
// import darklogo from "@/assets/iocns/thrivelogomain.svg";
// import lightlogo from "@/assets/iocns/thrive-icon-cropped.png";
import lightlogo from "@/assets/iocns/thrivelogomain.svg";

import ThemeToggle from "../common/DarkLightModeToggle";

export default function Header() {
  const location = useLocation();

  return (
    <div className="shadow-md dark:bg-neutral-900  bg--400">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex  justify-between items-center bg--400 w-full mr-6 ">
          <Link to="/" >
          
            <img
              src={lightlogo}
              className="object-contain w-[130px] dark: h-9"
              alt="logo"
            />
          </Link>

          <ul className="flex">
            <Link to="/signup">
              <li
                className={`px-3 py-1 font-semibold rounded-md ${
                  location.pathname === "/signup"
                    ? "bg-blue-500 text-slate-50"
                    : "text-slate-500 dark:text-white"
                }`}
              >
                SignUp
              </li>
            </Link>
            <Link to="/login">
              <li
                className={`px-3 py-1 font-semibold rounded-md ${
                  location.pathname === "/login"
                    ? "bg-blue-500 text-slate-50"
                    : "text-slate-500 dark:text-white"
                }`}
              >
                Login
              </li>
            </Link>
          </ul>
        </div>
          <ThemeToggle />
      </div>
    </div>
  );
}
