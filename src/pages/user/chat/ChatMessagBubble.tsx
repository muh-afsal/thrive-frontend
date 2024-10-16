import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { IMessage } from "@/types/IChat";
import React, { useEffect, useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";
import { MdInsertDriveFile } from "react-icons/md";

interface ChatMessageBubbleProps {
  isSender: boolean;
  message: IMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  isSender,
  message,
}) => {
  const [isMoreOption, setIsMoreOptions] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Handle click outside the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        setIsMoreOptions(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownVisible]);

  const handleConfirm = () => {
    // Handle confirm logic here
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const getMediaElement = (type: string, url: string) => {
    switch (type) {
      case "image":
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={url}
              alt="Message"
              className="w-60 h-60 object-cover rounded-lg mr-[-10px]"
            />
          </a>
        );
      case "video":
        return (
          <video
            src={url}
            controls
            className="w-60 h-60 rounded-lg mb-[-8px] mr-[-10px]"
          />
        );
      case "audio":
        return (
          <audio
            controls
            className="w-[250px] h-[40px] rounded-lg m-[-5px] mt-1 px-3"
          >
            <source src={url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
      case "document":
        return (
          <a
            href={`https://docs.google.com/viewer?url=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex text-white dark:text-white items-center p-4 border-neutral-300 border dark:border-neutral-600 rounded-lg justify-center"
          >
            <MdInsertDriveFile size={24} />
            <span className="ml-2 hover:underline">View Document</span>
          </a>
        );
      default:
        return null;
    }
  };

  const handleMouseEnterMessage = () => {
    if (!isDropdownVisible) {
      setIsMoreOptions(true);
    }
  };

  const handleMouseLeaveMessage = () => {
    if (!isDropdownVisible) {
      setIsMoreOptions(false);
    }
  };

  const handleClickMoreOption = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-3`}>
      {(isMoreOption || isDropdownVisible) && (
        <div className={`relative bg--400 inline-block  text-left${
          isSender ? "order-2 ml-1" : "order-1 mr-1"
        } `}>
          <IoMdMore
          
            onMouseEnter={handleMouseEnterMessage}
            onMouseLeave={handleMouseLeaveMessage}
            size={25}
            className="text-gray-500 hover:cursor-pointer"
            onClick={handleClickMoreOption}
          />
          <div
            id="dropdownDots"
            ref={dropdownRef}
            className={`absolute right-0 mt-2 w-40 mr-2 bg-white divide-y divide-gray-100 rounded-lg  dark:bg-neutral-700 dark:divide-neutral-600 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] ${
              isDropdownVisible ? "" : "hidden"
            }`}
            aria-labelledby="dropdownMenuIconButton"
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white"
                  >
                  Copy
                </a>
                <a
                  href="#"
                  onClick={() => setIsModalOpen(true)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-600 dark:hover:text-white"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
          {isModalOpen && (
        <ConfirmationModal
          onClose={handleClose}
          onConfirm={handleConfirm}
          size="md:w-96"
        />
      )}
        </div>
      )}

      <div
        onMouseEnter={handleMouseEnterMessage}
        onMouseLeave={handleMouseLeaveMessage}
        className="bg--500 flex justify-center"
      >
        <div
          className={`px-1 py-1 max-w-xs flex flex-col ${
            isSender ? "order-1" : "order-2"
          } ${
            isSender
              ? "bg-[#1da1f2] text-white rounded-l-lg rounded-tr-lg"
              : "bg-gray-200 dark:bg-neutral-800 dark:text-white text-gray-800 rounded-br-lg rounded-tr-lg rounded-tl-lg"
          }`}
        >
          {message.attachments.length > 0 ? (
            <div className="flex flex-col">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="mb-2">
                  {getMediaElement(attachment.type, attachment.url)}
                </div>
              ))}
              {message.content && (
                <div className="text-sm mt-2 rounded-full">
                  {message.content}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm px-3 rounded-full">{message.content}</div>
          )}
        </div>
        <div
          className={`h-8 w-8 mt-1 bg--300 rounded-full overflow-hidden ${
            isSender ? "order-2 ml-1" : "order-1 mr-1"
          }`}
        >
          <img
            src={message.sender.profileImage}
            alt="Profile Preview"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
