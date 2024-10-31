/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLIENT_API } from "@/axios";
// import { config } from "@/common/configuratoins";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import React, { useState, useRef } from "react";
// import { IoCloseCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
// import { IoCloseCircleOutline } from "react-icons/io5";

interface AddNewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewEventAdded: () => void;
}

const AddNewEventModal: React.FC<AddNewEventModalProps> = ({
  isOpen,
  onClose,
  onNewEventAdded,
}) => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [searchResults, setSearchResults] = useState<any[]>([]);
  // const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const { data } = useSelector((state: RootState) => state.user);

  const currentUser = data;

  const formatTimeWithAmPm = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    const isPM = hourNum >= 12;
    const formattedHour = hourNum % 12 || 12;
    const period = isPM ? "PM" : "AM";
    return `${formattedHour}:${minutes} ${period}`;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (!title) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";

    if (new Date(date).setHours(0, 0, 0, 0) < currentDate.getTime()) {
      newErrors.date = "Date should not be before today";
    }

    if (startDateTime < new Date()) {
      newErrors.startTime = "Start time should not be before the current time";
    }

    if (endDateTime <= startDateTime) {
      newErrors.endTime = "End time should be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    const eventData = {
      title,
      date,
      startTime: formatTimeWithAmPm(startTime),
      endTime: formatTimeWithAmPm(endTime),
      description,
      action: "add",
      adminId: currentUser?._id, 
    };


    try {
      console.log("started the sending");

      const response = await CLIENT_API.post("/media/event-action", eventData);
      console.log("Creating event:", response);

      onNewEventAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.log("Error creating event", error);
    }
  };

  const handleCloseClick = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setErrors({});

  };


  return (
    <div
    className={`fixed inset-0 z-50 ${
      isOpen ? "flex" : "hidden"
    } justify-center items-center bg-black bg-opacity-30`}
  >
    <div
      ref={modalRef}
      className="shadow-[0px_14px_42px_10px_#00000024] bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md"
    >
      <div className="flex justify-between mb-8 items-center">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Create New Event
        </h2>
        <div
          onClick={handleCloseClick}
          className="flex items-center justify-center bg-neutral-300 hover:bg-neutral-400  dark:bg-neutral-700 dark:hover:bg-neutral-600 hover:text-white rounded-full w-7 h-7 mb-3 "
        >
          <X className="" size={19} />
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 w-full focus:outline-none focus:border-blue-200"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium pl-1 mb-1 text-neutral-400 dark:text-neutral-400 ">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 w-full focus:outline-none focus:border-blue-200"
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>

      <div className=" flex gap-2 mb-4">
        <div className="mb-4 w-[50%] ">
          <label className="block text-sm font-medium pl-1 mb-1 text-neutral-400 dark:text-neutral-400">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 w-full focus:outline-none focus:border-blue-200"
          />
          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
          )}
        </div>

        <div className="mb-4 w-[50%]">
          <label className="block text-sm font-medium pl-1 mb-1 text-neutral-400 dark:text-neutral-400">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 w-full focus:outline-none focus:border-blue-200"
          />
          {errors.endTime && (
            <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 w-full focus:outline-none focus:border-blue-200"
          rows={3}
        ></textarea>
      </div>
    

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="dark:text-neutral-300 text-neutral-500 mr-2 px-4 py-1 rounded-lg dark:hover:bg-neutral-700 hover:bg-neutral-200 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateEvent}
          className="bg-thirve-blue text-white px-4 py-1 rounded-lg hover:bg-blue-400 transition duration-200"
        >
          Create Event
        </button>
      </div>
    </div>
    </div>
  );
};

export default AddNewEventModal;
