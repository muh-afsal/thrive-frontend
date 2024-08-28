import React, { useState } from 'react';
import { IoMdContact, IoMdLock, IoMdCard, IoMdNotifications } from 'react-icons/io';
import NavSidebar from '@/components/sidebars/NavSidebar';
import CategoryNavbar from '@/components/navbars/CategoryNavbar';
import Sidebar from '@/components/sidebars/CategorySidebar';
import GeneralInfo from '@/components/profile/Generalnfo';
import Security from '@/components/profile/Security';
import Billing from '@/components/profile/Billing';
import Notification from '@/components/profile/Notification';

const Profile: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(<GeneralInfo />);
  const [activeItem, setActiveItem] = useState<string>('General Info'); // Track the active item

  const sidebarItems = [
    { name: 'General Info', def: "Profile pic and details", icon: <IoMdContact size={25} />, component: <GeneralInfo /> },
    { name: 'Security', def: "Password & security", icon: <IoMdLock size={25} />, component: <Security /> },
    { name: 'Billing', def: "Billing & payment details", icon: <IoMdCard size={25} />, component: <Billing /> },
    { name: 'Notification', def: "Notification settings", icon: <IoMdNotifications size={25} />, component: <Notification /> },
  ];

  const handleItemClick = (component: React.ReactNode, name: string) => {
    setActiveComponent(component);
    setActiveItem(name); 
  };

  return (
    <div className='w-full h-screen'>
      <div className='h-full flex bg--100'>
        <section className='w-16 h-full bg--400'>
          <NavSidebar />
        </section>
        <section className='w-full h-screen overflow-hidden'>
          <CategoryNavbar />
          <div className='flex h-full'>
            <Sidebar
              items={sidebarItems.map(item => ({
                name: item.name,
                def: item.def,
                icon: item.icon,
                onClick: () => handleItemClick(item.component, item.name), 
              }))}
              activeItem={activeItem} 
            />
            <div className='flex-grow p-4 bg--400'>
              {activeComponent}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
