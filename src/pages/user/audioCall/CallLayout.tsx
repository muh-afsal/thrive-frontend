import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import NavSidebar from "@/components/sidebars/NavSidebar";
import { useState, useEffect } from "react";
import ContactSearchBar from "@/components/searchBars/ContactSearchbar";
import { IoCall } from "react-icons/io5";
import { useSocket } from "@/contexts/SocketContext";


const CallLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { socket } = useSocket();

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

   const handleStartInstantCall=()=>{
     if(socket){
         socket.emit('create-room')
     }
     
   }


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
          <CategoryNavbar toggleSidebar={toggleSidebar} categoryName="Call" />

          <div
            className={`flex-1 bg--400 transition-all duration-300 ease-in-out overflow-auto w-full`}
          >
            <div className="dark:bg--500 w-full  flex h-[100%] relative ">
              <div
                className={` ${
                  isSmallScreen
                    ? isSidebarOpen
                      ? "md:w-[700px] w-[1000px]"
                      : "w-0"
                    : " md:w-[700px] w-[1000px]"
                }  transition-all duration-300 ease-in-out contacts-listing scrollbar-custom  border-r border-gray-300 dark:border-neutral-700 overflow-y-auto flex flex-col`}
              >
                <div className="bg--400 pb-6 pt-2 border-b border-gray-300 dark:border-neutral-700">
                  <ContactSearchBar />
                </div>
                <div className="bg--400 h-full ">
                  <div className=" flex justify-center items-center h-full ">
                    <p className="dark:bg-neutral-700 rounded-lg px-3 dark:text-white bg-neutral-200">
                      No recent call log found
                    </p>
                  </div>
                </div>
              </div>
              <div className="chat-listing bg--500 justify-center items-center w-[100%] relative flex flex-col">
                <div className="flex justify-center items-center flex-col">
                  <button onClick={handleStartInstantCall} className="bg-blue-500 text-white hover:bg-blue-400 rounded-lg p-1 px-3 mb-7 dark:text-neutral-200 flex  items-center">
                    <IoCall size={19} className="mr-2" />
                    Start an Instant call
                  </button>
                    <p className="dark:text-white">or</p>
                  <div>
                    <h1 className="dark:text-neutral-400">
                      To start a call, go to Contacts and tap the call icon in
                      the top right corner.
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallLayout;
