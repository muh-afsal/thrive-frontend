import { Link } from "react-router-dom";
import logo from "@/assets/iocns/thive-logo.png";

export default function Header() {
  return (
    <div className="bg-transparent">
      <div className="flex justify-around items-center mx-auto p-3 bg-transparent">
        <div className="flex justify-between items-center bg-transparent">
          <Link to="/">
            <img src={logo} className="object-contain w-fit h-9 mr-14" alt="logo" />
          </Link>

          <ul className="flex justify-between gap-9 items-start text-sm bg-transparent">
            <Link to="/">
              <li className="text-slate-500 rounded-md px-3 py-1 font-semibold bg-transparent">
                Home
              </li>
            </Link>
            <Link to="/contact">
              <li className="text-slate-500 rounded-md px-3 py-1 font-semibold bg-transparent">
                Contact
              </li>
            </Link>
            <Link to="/about">
              <li className="text-slate-500 rounded-md px-3 py-1 font-semibold bg-transparent">
                About
              </li>
            </Link>
            <Link to="/profile">
              <li className="text-slate-500 rounded-md px-3 py-1 font-semibold bg-transparent">
                profile
              </li>
            </Link>
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
