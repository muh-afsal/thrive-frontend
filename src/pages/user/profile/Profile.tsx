import React, { useState, useEffect } from 'react';
import { IoMdContact, IoMdLock, IoMdCard, IoMdNotifications } from 'react-icons/io';
import NavSidebar from '@/components/sidebars/NavSidebar';
import CategoryNavbar from '@/components/navbars/CategoryNavbar';
import Sidebar from '@/components/sidebars/CategorySidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const sidebarItems = [
    { name: 'General Info', def: "Profile pic and details", icon: <IoMdContact size={25} />, pathTo: '/profile/general-info' },
    { name: 'Security', def: "Password & security", icon: <IoMdLock size={25} />, pathTo: '/profile/security' },
    { name: 'Billing', def: "Billing & payment details", icon: <IoMdCard size={25} />, pathTo: '/profile/billing' },
    { name: 'Notification', def: "Notification settings", icon: <IoMdNotifications size={25} />, pathTo: '/profile/notification'  },
  ];

  useEffect(() => {
    if (location.pathname === '/profile') {
      navigate('/profile/general-info');
    }
  }, [location.pathname, navigate]);

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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (path: string) => {
    navigate(path); 
  };

  return (
    <div className='w-full h-screen overflow-hidden dark:bg-dark-bg dark:text-white dark:border-neutral-700'>
      <div className='h-full flex bg--100 relative'>
        <div className={`bg--400 h-full border-r border-slate-200 dark:border-neutral-700 transition-all duration-300 ease-in-out 
                         ${isSmallScreen ? (isSidebarOpen ? 'w-16' : 'w-0') : 'w-16'} 
                         overflow-hidden z-50`}>
          <NavSidebar />
        </div>
        <div className='flex-1 h-screen overflow-hidden flex flex-col'>
          <CategoryNavbar toggleSidebar={toggleSidebar} categoryName='Profile Settings'/>
          <div className='flex-1 flex overflow-hidden relative'>
            <div className={` absolute top-0 left-0 h-full transition-all duration-300 ease-in-out 
                             ${isSmallScreen ? (isSidebarOpen ? 'w-[300px]' : 'w-0') : 'w-[300px]'} 
                             overflow-hidden z-40`}>
              <Sidebar
                items={sidebarItems.map(item => ({
                  name: item.name,
                  def: item.def,
                  icon: item.icon,
                  onClick: () => handleItemClick(item.pathTo),
                }))}
                // activeItem={activeItem} 
              />
            </div>
            <div className={`flex-1 p-4  dark:bg-dark-bg transition-all duration-300 ease-in-out overflow-auto
                             ${isSmallScreen ? 'w-full' : 'ml-72'}`}>
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
