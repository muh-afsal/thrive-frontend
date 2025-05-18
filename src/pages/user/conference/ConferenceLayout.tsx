/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import NavSidebar from "@/components/sidebars/NavSidebar";
import ContactSearchBar from "@/components/searchBars/ContactSearchbar";
import { useSocket } from "@/contexts/SocketContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { CLIENT_API } from "@/axios";
import { config } from "@/common/configuratoins";
import { Link, Copy, Video  } from "lucide-react"; 
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";

const ConferenceLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomLink, setRoomLink] = useState<string>("");
  const [inputLink, setInputLink] = useState<string>("");
  const navigate = useNavigate();

  const { data } = useSelector((state: RootState) => state.user);
  const currentUserId = data?._id;
  const { socket } = useSocket();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleStartInstantCall = () => {
    if (socket) {
      socket.emit("create-room", { currentUserId });
    }
  };

  useEffect(() => {
    socket?.on("room-created", ({ roomId }) => {
      const link = `${window.location.origin}/call-room/${roomId}`;
      setRoomLink(link);
      setIsModalOpen(true);
    });
  }, [socket]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomLink);
    toast.success("Call link copied to clipboard!");
  };

  const handleJoinCall = () => {
    const roomId = inputLink.split("/").pop();
    if (roomId) {
        sessionStorage.setItem(`callType_${roomId}`, 'video');
      navigate(`/call-room/${roomId}`);
    }
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
        <div className={`bg--400 h-full border-r border-slate-200 dark:border-neutral-700 transition-all duration-300 ease-in-out 
                           ${isSmallScreen ? isSidebarOpen ? "w-16" : "w-0" : "w-16"} overflow-hidden z-50`}>
          <NavSidebar />
        </div>
        <div className="flex-1 h-screen bg--400 overflow-hidden flex flex-col">
          <CategoryNavbar toggleSidebar={toggleSidebar} categoryName="Video Call" />
          <div className="flex-1 bg--400 transition-all duration-300 ease-in-out overflow-auto w-full">
            <div className="dark:bg--500 w-full flex h-[100%] relative">
              <div className={`${isSmallScreen ? isSidebarOpen ? "md:w-[700px] w-[1000px]" : "w-0" : "md:w-[700px] w-[1000px]"} 
                              transition-all duration-300 ease-in-out contacts-listing scrollbar-custom border-r border-gray-300 
                              dark:border-neutral-700 overflow-y-auto flex flex-col`}>
                <div className="bg--400 pb-6 pt-2 border-b border-gray-300 dark:border-neutral-700">
                  <ContactSearchBar />
                </div>
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
                        <div className="dark:bg-neutral-800 bg-neutral-300 rounded-full w-14 h-12 ml-7 flex items-center justify-center dark:text-neutral-400">
                          <Video size={20} />
                        </div>
                        <div className="justify-between px-2 items-center h-full ml-4 flex w-full">
                          <h1 className="text-base dark:text-neutral-400 font-medium flex items-center gap-2">
                            Conference Call
                          </h1>
                          <h1 className="text-sm dark:text-neutral-500">
                            Duration: {log.duration}
                          </h1>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="chat-listing bg--500 justify-center items-center w-[100%] relative flex flex-col">
                <div className="flex justify-center items-center flex-col">
                  <button onClick={handleStartInstantCall} className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg p-1 px-3 mb-2 dark:text-neutral-200 flex items-center">
                    <Link size={19} className="mr-4" />
                    Create a Call Room
                  </button>
                  <p className="dark:text-white">or</p>
                  <div className="flex items-center mt-4 mb-4">
                    <input
                      type="text"
                      placeholder="Enter room link"
                      className="p-2 border dark:border-gray-700 dark:text-neutral-100  border-gray-300 dark:bg-dark-bg rounded-md"
                      value={inputLink}
                      onChange={(e) => setInputLink(e.target.value)}
                    />
                    <button onClick={handleJoinCall} className="p-2 ml-2 bg-blue-500 flex gap-1 items-center text-white rounded-md hover:bg-blue-600">
                      <Video size={19} className="mr-2" /> Join Call
                    </button>
                  </div>
                  <div>
                    <h1 className="dark:text-neutral-400 text-center">
                      Create a call link for later, or enter a call link to join.
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-lg dark:text-neutral-200 mb-4">Room Created!</h2>
            <p className="text-sm dark:text-neutral-400 mb-4">Share this link to invite others:</p>
            <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-700 p-2 rounded-md">
              <span className="truncate text-sm dark:text-neutral-200">{roomLink}</span>
              <Copy 
                size={35}
                className="text-blue-500 cursor-pointer ml-3"
                onClick={handleCopyToClipboard}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-500 text-white mt-4 py-2 px-4 rounded-md hover:bg-blue-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceLayout;
