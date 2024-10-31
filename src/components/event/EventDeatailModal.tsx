/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { CLIENT_API } from "@/axios";
import { ObjectId } from "mongoose";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventData: {
    _id?: ObjectId;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
  } | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  eventData,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [editableEventData, setEditableEventData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (eventData) {
      setEditableEventData({
        title: eventData.title,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        description: eventData.description,
      });
    }
  }, [eventData]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false);
      setErrors({});
    }
  }, [isOpen]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleEditToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableEventData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startDateTime = new Date(
      `${editableEventData.date}T${editableEventData.startTime}`
    );
    const endDateTime = new Date(
      `${editableEventData.date}T${editableEventData.endTime}`
    );

    if (!editableEventData.title) newErrors.title = "Title is required";
    if (!editableEventData.date) newErrors.date = "Date is required";
    if (!editableEventData.startTime)
      newErrors.startTime = "Start time is required";
    if (!editableEventData.endTime) newErrors.endTime = "End time is required";

    if (
      new Date(editableEventData.date).setHours(0, 0, 0, 0) <
      currentDate.getTime()
    ) {
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

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const eventId = eventData?._id;

    const newEventData = {
      action: "edit",
      eventId,
      ...editableEventData,
    };

    try {
       await CLIENT_API.post(
        "/media/event-action",
        newEventData
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.log("Error creating event", error);
    }
    setIsEditMode(false);
  };

  const handleDeleteEvent = async () => {

    const eventId = eventData?._id;

    const newEventData = {
      action: "delete",
      eventId,
    };

    try {
      console.log("started the sending");

       await CLIENT_API.post(
        "/media/event-action",
        newEventData
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.log("Error creating event", error);
    }
    setIsEditMode(false);
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
          <div className="flex items-center gap-6">
            <Trash2
              size={19}
              className="cursor-pointer hover:text-red-300"
              onClick={handleDeleteEvent}
            />
            <Pencil
              size={19}
              className={`cursor-pointer ${
                isEditMode ? "text-blue-500" : "hover:text-blue-500"
              }`}
              onClick={handleEditToggle}
            />
            <div
              onClick={onClose}
              className="flex items-center pb-2 hover:text-neutral-600 cursor-pointer"
            >
              <X size={19} />
            </div>
          </div>
        </div>
        <div className="">
          <div className="mb-4 dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
            <h3 className="font-semibold">Event:</h3>
            {isEditMode ? (
              <input
                type="text"
                name="title"
                value={editableEventData.title}
                onChange={handleChange}
                className="bg-neutral-300 dark:bg-neutral-600 rounded px-2 py-1 w-full"
              />
            ) : (
              <p className="text-neutral-400">{editableEventData.title}</p>
            )}
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          <div className="mb-4 dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
            <h3 className="font-semibold">Date:</h3>
            {isEditMode ? (
              <input
                type="date"
                name="date"
                value={editableEventData.date}
                onChange={handleChange}
                className="bg-neutral-300 dark:bg-neutral-600 rounded px-2 py-1 w-full"
              />
            ) : (
              <p className="text-neutral-400">
                {formatDate(editableEventData.date)}
              </p>
            )}
            {errors.date && <p className="text-red-500">{errors.date}</p>}
          </div>

          <div className="flex justify-around gap-2 w-full">
            <div className="mb-4 w-[50%] dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
              <h3 className="font-semibold">Start Time:</h3>
              {isEditMode ? (
                <input
                  type="time"
                  name="startTime"
                  value={editableEventData.startTime}
                  onChange={handleChange}
                  className="bg-neutral-300 dark:bg-neutral-600 rounded px-2 py-1 w-full"
                />
              ) : (
                <p className="text-neutral-400">
                  {editableEventData.startTime}
                </p>
              )}
              {errors.startTime && (
                <p className="text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="mb-4 w-[50%] dark:bg-neutral-700 bg-neutral-200 flex gap-2 px-3 py-3 items-center rounded-lg">
              <h3 className="font-semibold">End Time:</h3>
              <div className="flex flex-col">
                {isEditMode ? (
                  <input
                    type="time"
                    name="endTime"
                    value={editableEventData.endTime}
                    onChange={handleChange}
                    className="bg-neutral-300 dark:bg-neutral-600 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-neutral-400">
                    {editableEventData.endTime}
                  </p>
                )}
                {errors.endTime && (
                  <p className="text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>

          {editableEventData.description && (
            <div className="mb-4 flex-col dark:bg-neutral-700 bg-neutral-200 max-h-[200px] flex gap-2 px-3 py-3 items-start rounded-lg overflow-auto scrollbar-custom">
              <h3 className="font-semibold">Description:</h3>
              {isEditMode ? (
                <textarea
                  name="description"
                  value={editableEventData.description}
                  onChange={handleChange}
                  className="bg-neutral-300 dark:bg-neutral-600 scrollbar-custom rounded px-2 py-1 w-full"
                  rows={4}
                />
              ) : (
                <p className="text-neutral-400">
                  {editableEventData.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="dark:text-neutral-300 text-neutral-500 px-4 py-1 rounded-lg dark:hover:bg-neutral-700 hover:bg-neutral-200 transition duration-200"
          >
            Cancel
          </button>
          {isEditMode && (
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
