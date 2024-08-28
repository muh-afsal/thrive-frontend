import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/iocns/thive-logo.png";

export default function Header() {
  const location = useLocation();
  
  return (
    <div className="shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <img src={logo} className="object-contain w-fit h-9" alt="logo" />
        </Link>

        <ul className="flex">
          <Link to='/signup'>
            <li className={`px-3 py-1 font-semibold rounded-md ${
              location.pathname === '/signup' ? 'bg-blue-500 text-slate-50' : 'text-slate-500'
            }`}>
              SignUp
            </li>
          </Link>
          <Link to='/login'>
            <li className={`px-3 py-1 font-semibold rounded-md ${
              location.pathname === '/login' ? 'bg-blue-500 text-slate-50' : 'text-slate-500'
            }`}>
              Login
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
