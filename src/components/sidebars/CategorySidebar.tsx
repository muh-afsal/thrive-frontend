import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SidebarItem {
  name: string;
  def: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { data } = useSelector((state: RootState) => state.user);
  const profileimage = data?.profileImage;

  const initialActiveItem = localStorage.getItem('activeItem') || items[0]?.name;

  const [activeItem, setActiveItem] = useState<string | undefined>(initialActiveItem);

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.name);
    localStorage.setItem('activeItem', item.name); 
    item.onClick(); 
  };

  useEffect(() => {
    const storedActiveItem = localStorage.getItem('activeItem');
    if (storedActiveItem) {
      setActiveItem(storedActiveItem); 
    }
  }, []);

  return (
    <div className='w-[300px] h-[100%] border-r border-gray-200  dark:border-neutral-700 flex justify-center dark:bg-dark-bg bg-white '>
      <ul>
        <div className='h-[230px] border-b border-gray-200 dark:border-neutral-700 mb-10 flex flex-col justify-center items-center'>
          <div className='w-[110px] h-[110px] overflow-hidden bg-red-300 rounded-2xl profilepic shadow-lg'>
            <img className='object-cover w-full h-full' src={profileimage} alt="Profile" />
          </div>
          <h1 className='font-semibold text-lg mt-4 dark:text-white '>{data?.firstname} {data?.lastname}</h1>
        </div>
        {items.map((item) => (
          <div
            key={item.name}
            className='w-[300px] h-20 flex justify-center items-center '
            onClick={() => handleItemClick(item)}
          >
            <div
              className={`rounded-md dark:hover:bg-neutral-700 hover:bg-blue-50 w-[90%] flex justify-center h-[85%] items-center
              ${item.name === activeItem ? 'bg-blue-50 dark:bg-neutral-800 dark:text-blue-400 text-thirve-blue shadow-sm' : 'text-gray-700 dark:text-neutral-200'}
              `}
            >
              <div className={`w-11 h-11 flex justify-center items-center  rounded-md mr-3
              ${item.name === activeItem ? 'text-thirve-blue' : ''}
              `}>
                {item.icon}
              </div>
              <div className='w-[85%]'>
                <p className='font-semibold text-sm'>{item.name}</p>
                <p className='text-xs text-slate-400 dark:text-neutral-500'>{item.def}</p>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
