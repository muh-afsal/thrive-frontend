/* eslint-disable @typescript-eslint/no-explicit-any */
import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import NavSidebar from "@/components/sidebars/NavSidebar";
import { useState, useEffect } from "react";
import ContactSearchBar from "@/components/searchBars/ContactSearchbar";
import { Link, Outlet, useNavigate } from "react-router-dom"; 
import { IoMdArrowBack } from "react-icons/io";
import AddBlogModal from "./AddBlogModal";


const BlogLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // const { data } = useSelector((state: RootState) => state.user);
  // const currentUserId = data?._id;
  // const { socket } = useSocket();
  const navigate = useNavigate(); 
  const [isModalOpen, setModalOpen] = useState(false);

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
          <CategoryNavbar toggleSidebar={toggleSidebar} categoryName="Blogs"/>

          <div
            className={`flex-1 bg--400 scrollbar-custom transition-all duration-300 ease-in-out overflow-auto w-full`}
          >
            <div className="bg--400   border-b flex justify-around items-center border-gray-300 dark:border-neutral-700">
              <div className="bg--300 flex justify-center items-center">
                <IoMdArrowBack
                  size={25}
                  className="dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer"
                  onClick={() => navigate(-1)}
                />
              </div>
              <div className="w-[40%]">
                <ContactSearchBar />
              </div>
              <div className="bg--500 flex h-6 gap-7 items-center">
                <Link to="/blog">
                  <span className="dark:text-neutral-400 text-sm items-center text-neutral-600 dark:hover:text-neutral-300 flex">
                    {/* <FaUser size={17} className="mr-1" /> */}
                    All Blogs
                  </span>
                </Link>
                <div  onClick={() => setModalOpen(true)} className="dark:text-neutral-400 flex gap-1 items-center text-neutral-600 dark:hover:text-neutral-300 cursor-pointer">
                  {/* <FaFilePen size={20} /> */}
                   Write
                </div>
                <Link to="/blog/my-blogs">
                  <span className="dark:text-neutral-400 text-sm items-center text-neutral-600 dark:hover:text-neutral-300 flex">
                    {/* <FaUser size={17} className="mr-1" /> */}
                    Your Blog
                  </span>
                </Link>
              </div>
              <AddBlogModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            </div>
            <div className="dark:bg-dark-bg dark:text-white h-[83vh]  w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;
