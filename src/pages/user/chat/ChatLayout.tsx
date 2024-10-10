import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import Sidebar from "@/components/sidebars/CategorySidebar";
import NavSidebar from "@/components/sidebars/NavSidebar";
import { useState, useEffect } from "react";
import { BsChatTextFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import { FaBoxArchive } from "react-icons/fa6";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const ChatLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };



  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 1280;
      setIsSmallScreen(smallScreen);
      setIsSidebarOpen(!smallScreen);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarItems = [
    { name: 'All Inbox', def: "Profile pic and details", icon: <BsChatTextFill size={20} />, pathTo: '/chat/all-inbox' },
    { name: 'Groups', def: "Password & security", icon: <MdGroups size={25} />, pathTo: '/chat/groups' },
    { name: 'Starred', def: "Billing & payment details", icon: <FaStar size={20} />, pathTo: '/chat/starred' },
    { name: 'Archived', def: "Notification settings", icon: <FaBoxArchive size={19} />, pathTo: '/chat/archived' },
  ];

  useEffect(() => {
    if (location.pathname === '/chat') {
      navigate('/chat/all-inbox');
    }
  }, [location.pathname, navigate]);

  return (
    <div className='w-full dark:bg-neutral-900 h-screen overflow-hidden'>
      <div className='h-full flex bg--100 relative'>
        <div className={`bg--400 h-full border-r border-slate-200 dark:border-neutral-700 transition-all duration-300 ease-in-out 
                         ${isSmallScreen ? (isSidebarOpen ? 'w-16' : 'w-0') : 'w-16'} 
                         overflow-hidden z-50`}>
          <NavSidebar />
        </div>
        <div className='flex-1 h-screen overflow-hidden flex flex-col'>
          <CategoryNavbar toggleSidebar={toggleSidebar} categoryName='Chats'/>
          <div className='flex-1 flex overflow-hidden relative'>
            <div className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out 
                             ${isSmallScreen ? (isSidebarOpen ? 'w-[300px]' : 'w-0') : 'w-[300px]'} 
                             overflow-hidden z-40`}>
              <Sidebar
                items={sidebarItems.map(item => ({
                  name: item.name,
                  def: item.def,
                  icon: item.icon,
                  onClick: () => handleItemClick(item.pathTo),
                }))}
              />
            </div>
            <div className={`flex-1 pl-3 bg--400 transition-all duration-300 ease-in-out overflow-auto
                             ${isSmallScreen ? 'w-full' : 'ml-72'}`}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ChatLayout;
