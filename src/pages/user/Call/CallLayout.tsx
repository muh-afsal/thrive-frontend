/* eslint-disable @typescript-eslint/no-explicit-any */
import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import NavSidebar from "@/components/sidebars/NavSidebar";
import { useState, useEffect } from "react";
import ContactSearchBar from "@/components/searchBars/ContactSearchbar";
import { IoCall } from "react-icons/io5";
import { useSocket } from "@/contexts/SocketContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { CLIENT_API } from "@/axios";
import { config } from "@/common/configuratoins";
import { Phone } from "lucide-react";

const CallLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSelector((state: RootState) => state.user);
  const currentUserId = data?._id;
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

  const handleStartInstantCall = () => {
    if (socket) {
      socket.emit('create-room', { currentUserId });
    }
  };

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setIsLoading(true);
        const response = await CLIENT_API.get("/media/get-callLogs", config);
        
        setCallLogs(response.data.callLogs);
      } catch (error) {
        console.error("Error fetching call logs", error);
        setCallLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallLogs();
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
          <CategoryNavbar toggleSidebar={toggleSidebar} categoryName="Call" />

          <div
            className={`flex-1 bg--400 transition-all duration-300 ease-in-out overflow-auto w-full`}
          >
            <div className="dark:bg--500 w-full flex h-[100%] relative ">
              <div
                className={`${
                  isSmallScreen
                    ? isSidebarOpen
                      ? "md:w-[700px] w-[1000px]"
                      : "w-0"
                    : "md:w-[700px] w-[1000px]"
                } transition-all duration-300 ease-in-out contacts-listing scrollbar-custom border-r border-gray-300 dark:border-neutral-700 overflow-y-auto flex flex-col`}
              >
                <div className="bg--400 pb-6 pt-2 border-b border-gray-300 dark:border-neutral-700">
                  <ContactSearchBar />
                </div>
                {/* Display call logs */}
                <div className="bg--400 flex flex-col overflow-y-auto scrollbar-custom">
                  {isLoading ? (
                    <p className="dark:bg-neutral-700 rounded-lg px-3 dark:text-white bg-neutral-200 text-center">
                      Loading call logs...
                    </p>
                  ) : callLogs.length === 0 ? (
                    <p className="dark:bg-neutral-700 rounded-lg px-3 dark:text-white bg-neutral-200 text-center">
                      No call logs found.
                    </p>
                  ) : (
                    callLogs.map((log) => (
                      <div key={log._id} className="w-full border-b dark:border-neutral-700 h-[70px] flex items-center p-2">
                        <div className="dark:bg-neutral-800 bg-neutral-300 rounded-full w-14 h-12 ml-7 flex items-center justify-center dark:text-neutral-400"><Phone size={20}/></div>
                        <div className=" justify-between px-2 items-center  h-full ml-4 flex w-full ">
                          <h1 className="text-base dark:text-neutral-400  font-medium  flex items-center gap-2"> Audio Call</h1>
                          <h1 className=" text-sm dark:text-neutral-500">Duration: {log.duration}</h1>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="chat-listing bg--500 justify-center items-center w-[100%] relative flex flex-col">
                <div className="flex justify-center items-center flex-col">
                  <button onClick={handleStartInstantCall} className="bg-blue-500 text-white hover:bg-blue-400 rounded-lg p-1 px-3 mb-7 dark:text-neutral-200 flex items-center">
                    <IoCall size={19} className="mr-2" />
                    Start an Instant call
                  </button>
                  <p className="dark:text-white">or</p>
                  <div>
                    <h1 className="dark:text-neutral-400 text-center">
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
