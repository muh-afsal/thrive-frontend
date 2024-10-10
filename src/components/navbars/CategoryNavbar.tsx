import { RootState } from '@/redux/store';
import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import ThemeToggle from '../common/DarkLightModeToggle';

interface CategoryNavbarProps {
  toggleSidebar: () => void;
  categoryName:string
}

const CategoryNavbar: React.FC<CategoryNavbarProps> = ({ toggleSidebar,categoryName }) => {
  const { data,error } = useSelector((state: RootState) => state.user);
  if (error) {
  console.log('---------------------');}

  const profileimage=data?.profileImage;


  return (
    <section className='w-full bg--400 dark:bg-dark-bg  h-16 flex shadow-md z-50  top-0 left-0 dark:border-b dark:border-neutral-700'>
      <div className='w-[70%] h-full flex items-center p-6'>
        <div 
          className='xl:hidden w-7 h-7 flex justify-center items-center dark:text-neutral-300  rounded-md dark:border-neutral-700 border border-gray-100 cursor-pointer'
          onClick={toggleSidebar}
        >
          <GiHamburgerMenu />
        </div>
        <h1 className='ml-7 font-bold text-xl w-max dark:text-white'>{categoryName}</h1>
      </div>
      <div className='w-[50%] h-full flex justify-end items-center p-6 bg--400'>
        
        <ThemeToggle/>
      
        <div className='w-10 h-10 bg-neutral-700-400 rounded overflow-hidden shadow-md'>
        <img className='object-cover w-full h-full ' src={profileimage} alt="" />
        </div>
      </div>
    </section>
  );
};

export default CategoryNavbar;