import React from "react";
import { X } from "lucide-react";
import { ObjectId } from "mongoose";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: {
    _id?: ObjectId;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
  } | null;
}

const PastEventdetails: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  eventData,
}) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center bg-black bg-opacity-30`}
    >
      <div className="shadow-[0px_14px_42px_10px_#00000024] bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between mb-8 items-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Event Details
          </h2>
          <div
            onClick={onClose}
            className="flex items-center pb-2 hover:text-neutral-600 cursor-pointer"
          >
            <X size={19} />
          </div>
        </div>
        <div className="">
          <div className="mb-4 dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
            <h3 className="font-semibold">Event:</h3>
            <p className="text-neutral-400">{eventData?.title || "N/A"}</p>
          </div>

          <div className="mb-4 dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
            <h3 className="font-semibold">Date:</h3>
            <p className="text-neutral-400">
              {eventData ? formatDate(eventData.date) : "N/A"}
            </p>
          </div>

          <div className="flex justify-around gap-2 w-full">
            <div className="mb-4 w-[50%] dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
              <h3 className="font-semibold">Start Time:</h3>
              <p className="text-neutral-400">
                {eventData?.startTime || "N/A"}
              </p>
            </div>

            <div className="mb-4 w-[50%] dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
              <h3 className="font-semibold">End Time:</h3>
              <p className="text-neutral-400">{eventData?.endTime || "N/A"}</p>
            </div>
          </div>

          {eventData?.description && (
            <div className="mb-4 flex-col dark:bg-neutral-700 bg-neutral-200 max-h-[200px] flex gap-2 px-3 py-3 items-start rounded-lg overflow-auto scrollbar-custom">
              <h3 className="font-semibold">Description:</h3>
              <p className="text-neutral-400">{eventData.description}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="dark:text-neutral-300 text-neutral-500 px-4 py-1 rounded-lg dark:hover:bg-neutral-700 hover:bg-neutral-200 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default  PastEventdetails;
