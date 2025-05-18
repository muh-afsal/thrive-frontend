import { Link } from "react-router-dom";
import ThemeToggle from "../common/DarkLightModeToggle";
import ThriveLogo from "../common/ThriveLogo";

export default function Header() {

  return (
    <div className="bg-transparent mb-5 ">
      <div className="flex justify-center items-center  mx-auto p-3 bg-transparent">
        <div className="flex justify-around items-center bg-transparent w-[90%]">
         <ThriveLogo/>

          <ul className="md:flex justify-between hidden gap-12 items-start text-base bg-transparent ">
            <Link to="/">
              <li className="text-slate-500 hover:text-blue-500 dark:hover:text-blue-500 rounded-md px-3 py-1 dark:text-white font-semibold bg-transparent">
                Home
              </li>
            </Link>
            <Link to="/contact">
              <li className="text-slate-500 hover:text-blue-500 dark:hover:text-blue-500 rounded-md px-3 py-1 dark:text-white font-semibold bg-transparent">
                Contact
              </li>
            </Link>
            <Link to="/about">
              <li className="text-slate-500 hover:text-blue-500 dark:hover:text-blue-500 rounded-md px-3 mr-7 py-1 dark:text-white font-semibold bg-transparent">
                About
              </li>
            </Link>

          </ul>
          <ul className="flex">
            <Link to="/signup ">
              <li
                className={`px-3 py-1 font-semibold hover:text-blue-500 dark:hover:text-blue-500 rounded-md `}
              >
                SignUp
              </li>
            </Link>
            <Link to="/login">
              <li
                className={`px-3 py-1 font-semibold hover:text-blue-500 dark:hover:text-blue-500 rounded-md `}
              >
                Login
              </li>
            </Link>
            <ThemeToggle  />
          </ul>
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
