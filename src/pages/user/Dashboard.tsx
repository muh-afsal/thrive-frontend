import React, { useEffect, useState } from "react";
import NavSidebar from "@/components/sidebars/NavSidebar";
import CategoryNavbar from "@/components/navbars/CategoryNavbar";
import usersImage from "@/assets/images/landing/dashboardusers.png";
import { CalendarDays } from "lucide-react";
import EventsContainer from "@/components/event/EventsContainer";
import { MonitorSmartphone } from "lucide-react";
import { FaBlog } from "react-icons/fa6";
import { MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { CLIENT_API } from "@/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface EventData {
  date: string;
  title: string;
  startTime: string;
  endTime: string;
}

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const { data } = useSelector((state: RootState) => state.user);

  const currentUserId = data?._id;

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

  useEffect(() => {
    const fetchAllEvents = async () => {
      if (!currentUserId) return;

      try {
        const response = await CLIENT_API.get(`/media/get-events/${currentUserId}`);
        const EventsData = response.data.events;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validEvents = EventsData.filter((event: EventData) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });

        validEvents.sort((a: { date: string | number | Date; startTime: string; }, b: { date: string | number | Date; startTime: string; }) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          const timeA = a.startTime.split(":").map(Number).reduce((acc: number, time: number) => acc * 60 + time);
          const timeB = b.startTime.split(":").map(Number).reduce((acc: number, time: number) => acc * 60 + time);
          
          return dateA - dateB || timeA - timeB;
        });

        setEventData(validEvents);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchAllEvents();
  }, [currentUserId]);

  return (
    <div className="relative dark:bg-neutral-900 dark:text-white z-0 h-screen">
      <div className="flex h-full">
        <div
          className={`bg--400 h-full border-r border-slate-200 dark:border-neutral-700 ${
            isSmallScreen ? (isSidebarOpen ? "w-16" : "w-0") : "w-16"
          } overflow-hidden z-50`}
        >
          <NavSidebar />
        </div>
        <div className="w-full h-full">
          <div className={`relative z-10 dark:bg-neutral-900 pl-0 ${isSidebarOpen && "pl-"}`}>
            <CategoryNavbar toggleSidebar={toggleSidebar} categoryName={"Dashboard"} />
          </div>
          <div className="relative bg--500 h-[92.3vh] flex">
            <div className="bg--500 w-full lg:w-9/12 h-full">
              <div className="h-[30%] bg--300 py-4 px-3">
                <div className="bg-gradient from-blue-200 to-cyan-200 bg-blue-200 dark:bg-sky-700 dark:to-slate-700 dark:border dark:border-neutral-800 shadow-[inset_0px_0px_7px_0px_#D3D3D3] dark:shadow-none text-black w-full h-full rounded-xl relative">
                  <div className="flex flex-col gap-5 pt-10 pl-6">
                    <h1 className="font-bold text-2xl md:text-3xl dark:text-white">
                      Your Teammates are online..
                    </h1>
                    <h3 className="md:text-xl text-base font-thin w-[60%] dark:text-neutral-50">
                      Start Instant call conference meeting or start a new chats with a welcome message, add events
                    </h3>
                  </div>
                  <div
                    className="md:h-full md:w-[300px] h-[150px] w-[200px] bg-cover bg-center absolute bottom-0 right-0 md:right-24"
                    style={{ backgroundImage: `url(${usersImage})` }}
                  />
                </div>
              </div>
              <div className="h-[70%] bg--500 px-4 pb-4">
                <div className="bg--400 w-full h-full rounded-lg lg:flex lg:flex-row flex-col gap">
                  <div className="bg--400 shadow-[inset_0px_0px_7px_0px_#D3D3D3] dark:shadow-[inset_0px_0px_7px_0px_#000000] dark:border dark:border-neutral-800 lg:w-[50%] w-full lg:h-full md:h-[50%] h-[50vh] rounded-lg mb-3 overflow-y-auto scrollbar-custom">
                    <div className="h-[80px] flex p-5 border-b dark:border-neutral-700 border-neutral-300">
                      <div className="w-[70%] h-full flex flex-col justify-center">
                        <h1 className="font-semibold text-xl">Upcoming Events</h1>
                        <h1 className="font-thin text-sm">Scheduled meetings and calls</h1>
                      </div>
                      <div className="md:w-[30%] w-[50%] h-full dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-neutral-2  00 bg-neutral-100 rounded-lg">
                        <Link to={"/event"}>
                          <span className="flex text-sm justify-center gap-2 pt-[9px] dark:text-blue-400 text-blue-600">
                            <CalendarDays size={19} />
                            View schedules
                          </span>
                        </Link>
                      </div>
                    </div>
                    {/* Display upcoming events */}
                    {eventData.map((event, index) => (
                      <EventsContainer key={index} title={event.title} startTime={event.startTime} endTime={event.endTime} date={event.date} />
                    ))}
                  </div>
                  <div className="bg--400 lg:w-[50%] w-full lg:h-full h-[50%] rounded-lg lg:ml-3 flex flex-col gap-3">
                    <div className="bg--400 h-[50%] w-full rounded-lg shadow-[inset_0px_0px_7px_0px_#D3D3D3] dark:border dark:border-neutral-800 dark:shadow-[inset_0px_0px_7px_0px_#000000]">
                      <div className="h-[30%] bg--400 flex flex-col justify-center px-6">
                        <h1 className="font-semibold text-lg">Quick Actions</h1>
                        <h1 className="font-thin text-sm">Plan a meeting or start a call</h1>
                      </div>
                      <div className="h-[70%] grid grid-cols-2 gap-2 p-4 dark:text-blue-400 text-blue-700">
                        <Link to={"/video-call"} className="rounded-md flex justify-center items-center border hover:bg-blue-50 dark:hover:bg-neutral-800 border-neutral-300 gap-3 dark:border-neutral-700 ">
                          <MonitorSmartphone size={25} />Start Conference Call
                        </Link>
                        <Link to={"/blog"} className="rounded-md flex justify-center items-center border hover:bg-blue-50 dark:hover:bg-neutral-800 border-neutral-300 gap-3 dark:border-neutral-700 ">
                          <FaBlog size={20} />Explore in Blog
                        </Link>
                        <Link to={"/chat"} className="rounded-md flex justify-center items-center border hover:bg-blue-50 dark:hover:bg-neutral-800 border-neutral-300 gap-3 dark:border-neutral-700 ">
                          <MessagesSquare size={25} />Send Private Messages
                        </Link>
                        <Link to={"/event"} className="rounded-md flex justify-center items-center border hover:bg-blue-50 dark:hover:bg-neutral-800 border-neutral-300 gap-3 dark:border-neutral-700 ">
                          <CalendarDays size={20} />Schedule Events
                        </Link>
                      </div>
                    </div>
                    <div className="h-[50%] w-full rounded-lg dark:border dark:border-neutral-800 shadow-[inset_0px_0px_7px_0px_#D3D3D3] dark:shadow-[inset_0px_0px_7px_0px_#000000]">
                      <h1 className="font-semibold text-lg p-4 dark:text-neutral-50 ">Notifications</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg--500 w-3/12 hidden lg:flex rounded-lg h-full lg:ml-3 ">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
