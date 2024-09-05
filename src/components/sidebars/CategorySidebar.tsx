import React from 'react';

interface SidebarItem {
  name: string;
  def: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string; // Add activeItem prop to track the active item
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem }) => {
  return (
    <div className=' w-[300px] h-[92.3%] border-r border-gray-200 flex justify-center'>
      <ul>
        <div className='h-[230px] border-b border-gray-200 mb-10 flex flex-col justify-center items-center'>
          <div className='w-[110px] h-[110px] bg-red-300 rounded-2xl'></div>
          <h1 className='font-semibold text-lg mt-4'>UserName</h1>
        </div>
        {items.map((item) => (
          <div
            key={item.name}
            className={`w-[300px] h-20 flex justify-center items-center `}
            onClick={item.onClick}
          >
            <div className={`rounded-md w-[90%] flex justify-center h-[85%] items-center ${item.name === activeItem ? 'bg-blue-50 text-thirve-blue' : 'text-gray-700'} `}>
              <div className='w-[90%] flex justify-'>
                <li className='flex flex-row space-x-2 font-semibold cursor-pointer'>
                  <div className='flex pl-4 items-center'>
                    {React.cloneElement(item.icon as React.ReactElement, { className: 'mr-5' })}
                  </div>
                  <div className='flex flex-col'>
                    <span className={`${item.name === activeItem ? ' text-thirve-blue' : 'text-slate-700'} `}>{item.name}</span>
                    <span className='text-slate-400 text-xs'>{item.def}</span>
                  </div>
                </li>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
