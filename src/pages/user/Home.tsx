import React, { useState } from "react";
import NavSidebar from "@/components/sidebars/NavSidebar";
import CategoryNavbar from "@/components/navbars/CategoryNavbar";

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };




  return (
    <div className="relative pl-16 dark:bg-neutral-900  dark:text-white ">
      <div className="relative z-10 dark:bg-neutral-900">
      <CategoryNavbar toggleSidebar={toggleSidebar} categoryName={'Home'}/>
      </div>
      <div className="absolute z-20 top-0 left-0 ">
        <NavSidebar />
      </div>
      {/* Content behind the NavSidebar */}
      <div className="relative z-0 dark:bg-neutral-900 h-screen">
        <h1 className="mt-20 text-center text-3xl font-bold">Welcome to Thrive Home Page</h1>
      </div>
    </div>
  );
};

export default Home;
