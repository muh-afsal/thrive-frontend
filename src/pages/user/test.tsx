import React, { useState, useEffect } from 'react';
import { IoMdContact, IoMdLock, IoMdCard, IoMdNotifications } from 'react-icons/io';
import NavSidebar from '@/components/sidebars/NavSidebar';
import CategoryNavbar from '@/components/navbars/CategoryNavbar';
import Sidebar from '@/components/sidebars/CategorySidebar';
import GeneralInfo from '@/components/profile/Generalnfo';
import Security from '@/components/profile/Security';
import Billing from '@/components/profile/Billing';
import Notification from '@/components/profile/NotificationSettings';

const Profile: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<GeneralInfo />);
  const [activeItem, setActiveItem] = useState<string>('General Info');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const sidebarItems = [
    { name: 'General Info', def: "Profile pic and details", icon: <IoMdContact size={25} />, component: <GeneralInfo /> },
    { name: 'Security', def: "Password & security", icon: <IoMdLock size={25} />, component: <Security /> },
    { name: 'Billing', def: "Billing & payment details", icon: <IoMdCard size={25} />, component: <Billing /> },
    { name: 'Notification', def: "Notification settings", icon: <IoMdNotifications size={25} />, component: <Notification /> },
  ];

  const handleItemClick = (component: React.ReactNode, name: string) => {
    setActiveComponent(component);
    console.log(component,name,'this is the------------------');
    
    setActiveItem(name);
  };

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

  return (
    <div className='w-full h-screen overflow-hidden'>
      <div className='h-full flex bg--100 '>
        <div className={ `bg--500 h-full transition-all duration-300 ease-in-out border-r border-slate-100
                         ${isSmallScreen ? (isSidebarOpen ? 'w-16' : 'w-0') : 'w-16'} 
                         overflow-hidden `}>
          <NavSidebar />
        </div>
        <div className=' flex-1 h-screen overflow-hidden flex flex-col'>
          <CategoryNavbar toggleSidebar={toggleSidebar} />
          <div className='flex-1 flex  relative'>
            <div className={`bg-white border-r border-slate-100 w-full absolute top-0 left-0 h-full transition-all duration-300 ease-in-out 
                             ${isSmallScreen ? (isSidebarOpen ? 'w-[299px]' : 'w-0') : 'w-[299px] bg--300'} 
                             overflow-hidden z-50`}>
              <Sidebar
                items={sidebarItems.map(item => ({
                  name: item.name,
                  def: item.def,
                  icon: item.icon,
                  onClick: () => handleItemClick(item.component, item.name),
                }))}
                activeItem={activeItem}
              />
            </div>
            <div className={`flex-1 p-4 bg--400 transition-all duration-300 ease-in-out overflow-auto
                             ${isSmallScreen ? 'w-full' : 'ml-72'}`}>
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


