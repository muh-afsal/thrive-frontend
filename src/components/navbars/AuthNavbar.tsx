import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../common/DarkLightModeToggle";
import ThriveLogo from "../common/ThriveLogo";

export default function Header() {
  const location = useLocation();



  return (
    <div className="shadow-[0px_3px_23px_0px_#00000024] dark:shadow-[0px_-3px_33px_0px_#000000] absolute w-full dark:bg-dark-bg  bg--400">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex  justify-between items-center bg--400 w-full mr-6  ">
        <ThriveLogo/>

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
