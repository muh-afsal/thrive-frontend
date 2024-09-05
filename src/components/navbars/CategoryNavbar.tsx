import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

interface CategoryNavbarProps {
  toggleSidebar: () => void;
}

const CategoryNavbar: React.FC<CategoryNavbarProps> = ({ toggleSidebar }) => {
  return (
    <section className='w-full bg--400 h-16 flex shadow-md z-50  top-0 left-0'>
      <div className='w-[70%] h-full flex items-center p-6'>
        <div 
          className='xl:hidden w-7 h-7 flex justify-center items-center rounded-md border border-gray-100 cursor-pointer'
          onClick={toggleSidebar}
        >
          <GiHamburgerMenu />
        </div>
        <h1 className='ml-7 font-bold w-max'>Profile Settings</h1>
      </div>
      <div className='w-[50%] h-full flex justify-end items-center p-6'>
        <div className='w-10 h-10 bg-red-400 rounded'></div>
      </div>
    </section>
  );
};

export default CategoryNavbar;