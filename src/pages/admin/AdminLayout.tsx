
import { useState, useEffect } from "react";
import { MdGroups } from "react-icons/md";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import AdminSideBar from "@/components/sidebars/AdminSideBar";
import { FaBlog } from "react-icons/fa6";
import AdminCategoryNavbar from "@/components/navbars/AdminCategoryNavbar";

const AdminLayout: React.FC = () => {
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
    { name: 'Dashboard', def: "Statistics and quick actions", icon: <LayoutDashboard size={20} />, pathTo: '/admin' },
    { name: 'Manage Users', def: "Manage the registered users", icon: <MdGroups size={25} />, pathTo: '/admin/users' },
    { name: 'Manage Blogs', def: "Manage the created Blogs", icon: <FaBlog size={20} />, pathTo: '/admin/blogs' },
  ];

  useEffect(() => {
    if (location.pathname === '/chat') {
      navigate('/chat/all-inbox');
    }
  }, [location.pathname, navigate]);

  return (
    <div className='w-full dark:bg-neutral-900 h-screen overflow-hidden'>
      <div className='h-full flex bg--100 relative'>
        <div className='flex-1 h-screen overflow-hidden flex flex-col'>
          <AdminCategoryNavbar toggleSidebar={toggleSidebar} categoryName='Chats'/>
          <div className='flex-1 flex overflow-hidden relative'>
            <div className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out 
                             ${isSmallScreen ? (isSidebarOpen ? 'w-[350px]' : 'w-0') : 'w-[350px]'} 
                             overflow-hidden z-40`}>
              <AdminSideBar
                items={sidebarItems.map(item => ({
                  name: item.name,
                  def: item.def,
                  icon: item.icon,
                  onClick: () => handleItemClick(item.pathTo),
                }))}
              />
            </div>
            <div className={`flex-1 bg--400 transition-all duration-300 ease-in-out overflow-auto
                             ${isSmallScreen ? 'w-full' : 'ml-[350px]'}`}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminLayout;
