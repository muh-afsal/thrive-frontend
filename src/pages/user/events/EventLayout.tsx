/* eslint-disable @typescript-eslint/no-explicit-any */
import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import NavSidebar from "@/components/sidebars/NavSidebar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
const EventLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // const { data } = useSelector((state: RootState) => state.user);
  // const currentUserId = data?._id;
  // const { socket } = useSocket();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 1280;
      setIsSmallScreen(smallScreen);
      setIsSidebarOpen(!smallScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (
    <div className="w-full dark:bg-neutral-900 h-screen overflow-hidden">
      <div className="h-full flex bg--100 relative">
        <div
          className={`bg--400 h-full border-r border-slate-200 dark:border-neutral-700 transition-all duration-300 ease-in-out 
                         ${
                           isSmallScreen
                             ? isSidebarOpen
                               ? "w-16"
                               : "w-0"
                             : "w-16"
                         } 
                         overflow-hidden z-50`}
        >
          <NavSidebar />
        </div>
        <div className="flex-1 h-screen bg--400 overflow-hidden flex flex-col">
          <CategoryNavbar
            toggleSidebar={toggleSidebar}
            categoryName="Schedules"
          />

          <div
            className={`flex-1 bg--400 scrollbar-custom transition-all duration-300 ease-in-out overflow-auto w-full`}
          >
            
            <div className="dark:bg-dark-bg dark:text-white h-[83vh]  w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLayout;
