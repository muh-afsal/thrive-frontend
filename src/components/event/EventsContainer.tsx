import { CalendarDays } from "lucide-react";

interface EventProps {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

const EventsContainer: React.FC<EventProps> = ({ title, date, startTime, endTime }) => {

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <div className=" mb-1 dark:text-neutral-200 h-[75px] w-full flex justify-between px-6 ">
      <span className="flex items-center bg--300 gap-6 dark:text-neutral-500 text-neutral-600">
        <CalendarDays />
        <span className="dark:text-neutral-300 text-neutral-600">
          <h1 className="text-lg">{title}</h1>
          <p className="text-sm">{`${startTime} - ${endTime}`}</p>
        </span>
      </span>
      <span className="text-sm dark:text-neutral-400  pt-5">
        <p>{formatDate(date)}</p>
      </span>
    </div>
  );
};

export default EventsContainer;
