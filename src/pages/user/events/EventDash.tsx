/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import AddNewEventModal from "./AddEventModal";
import { CLIENT_API } from "@/axios";
import EventDetailModal from "@/components/event/EventDeatailModal";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
// import ContactSearchBar from "@/components/searchBars/ContactSearchbar";
import { CalendarClock, ClipboardCheck, Plus } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useSocket } from "@/contexts/SocketContext";

interface EventData {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

const EventDash: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.user);

  const currentUserId = data?._id;

  const { notificationSocketService } = useSocket();
  const h = 5;

  notificationSocketService?.emit("text", { h });

  const eventColors = useRef<Record<string, string>>({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

        setEventData(validEvents);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchAllEvents();
  }, [shouldFetch]);

  const handleNewEventAdded = () => {
    closeModal();
    setShouldFetch((prev) => !prev);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const parseTime = (time: string): Date => {
    const [hourMinute, period] = time.split(" ");
    const [hours, minutes] = hourMinute.split(":").map(Number);
    const date = new Date();
    date.setHours(hours % 12 + (period === "PM" ? 12 : 0), minutes, 0, 0);
    return date;
  };

  const eventsByDate = eventData.reduce((acc, event) => {
    const eventDate = formatDate(event.date);
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {} as Record<string, EventData[]>);

  Object.keys(eventsByDate).forEach((date) => {
    eventsByDate[date] = eventsByDate[date].sort((a, b) => {
      const timeA = parseTime(a.startTime).getTime();
      const timeB = parseTime(b.startTime).getTime();
      return timeA - timeB;
    });
  });

  const sortedDates = Object.keys(eventsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <>
      <div className="w-full h-full flex p-3 md:px-16 flex-col ">
        <div className="navbar border-b flex justify-around items-center border-gray-300 dark:border-neutral-700">
          <div className="bg--300 flex justify-center items-center">
            <IoMdArrowBack
              size={25}
              className="dark:text-neutral-400 dark:hover:text-neutral-300 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="w-[40%] h-12">
            {/* <ContactSearchBar /> */}
          </div>
          <div className="bg--500 flex h-6 gap-7 items-center">
            <span
              onClick={openModal}
              className="dark:text-neutral-400 cursor-pointer text-sm items-center dark:bg-neutral-700 bg-neutral-200 px-2 py-1 rounded-lg text-neutral-700 dark:hover:text-neutral-300 flex"
            >
              <Plus size={15} className="mr-1" /> Add Event
            </span>
            <Link to="/event/past">
              <span
                onClick={openModal}
                className="dark:text-neutral-400 cursor-pointer text-sm items-center dark:bg-neutral-700 bg-neutral-200 px-2 py-1 rounded-lg text-neutral-700 dark:hover:text-neutral-300 flex"
              >
                <ClipboardCheck size={15} className="mr-1" /> Past Events
              </span>
            </Link>
          </div>
          <AddNewEventModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onNewEventAdded={handleNewEventAdded}
          />
        </div>
        <h1 className=" font-semibold text-2xl mt-6 mb-6">My Schedules</h1>
        {eventData && eventData.length > 0 ? (
          <div className="overflow-y-scroll scrollbar-custom bg">
            {sortedDates.map((date) => (
              <div
                key={date}
                className="w-full h-[170px] dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 mb-4"
              >
                <div className="h-[20%] border-b dark:border-neutral-700 rounded-tl-md rounded-tr-md">
                  <p className="px-2 text-lg">{date}</p>
                </div>
                <div className="h-[80%] w-full grid grid-flow-col auto-cols-min overflow-x-scroll gap-2 p-2 scrollbar-custom">
                  {eventsByDate[date].map((event) => (
                    <div
                      key={event._id}
                      onClick={() => handleEventClick(event)}
                      className={`rounded-md w-[300px] h-full p-2 cursor-pointer dark:hover:bg-blue-400 hover:bg-blue-300 dark:bg-blue-300 bg-blue-200 text-black ${
                        eventColors.current[event._id]
                      }`}
                    >
                      <span className="flex  gap-3 mb-3">
                        {" "}
                        <CalendarClock size={25} />
                        <h3 className="text-black text-xl line-clamp-1 font-bold ">
                          {event.title}
                        </h3>
                      </span>
                      <p className="text-black">
                        {event.startTime} - {event.endTime}
                      </p>
                      <p className="line-clamp-1 text-neutral-800">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {" "}
            <p className="text-center  dark:bg-neutral-800 bg-neutral-200 rounded-md px-3">
              Coudn't find any Schedules...!,{" "}
              <span onClick={openModal} className="text-blue-500 cursor-pointer">
                {" "}
                Add Event{" "}
              </span>
            </p>
          </div>
        )}
      </div>

      <div>
        <EventDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onSuccess={() => setShouldFetch((prev) => !prev)}
          eventData={selectedEvent}
        />
        <AddNewEventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onNewEventAdded={handleNewEventAdded}
        />
      </div>
    </>
  );
};

export default EventDash;
