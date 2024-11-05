import React, { useState, useEffect, useRef } from "react";
import ContactSearchBar from "@/components/searchBars/ContactSearchbar";
import UserContact from "@/components/chat/UserContact";
import { useSelector } from "react-redux";
import { IoMdMore } from "react-icons/io";
import { GrAttachment } from "react-icons/gr";
import { GrMicrophone } from "react-icons/gr";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { TbSend2 } from "react-icons/tb";
import { FaRegFaceSmile } from "react-icons/fa6";
import { MdPhotoCamera, MdVideoCall, MdAttachFile } from "react-icons/md";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CLIENT_API } from "@/axios";
import { FiEdit } from "react-icons/fi";
import AddNewChatModal from "@/components/chat/AddnewChatModal";
import { HiTrash } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

import {
  uploadAudioFile,
  uploadMultipleDocuments,
  uploadMultipleImages,
  uploadMultipleVideos,
} from "@/utils/cloudinary/cloudinaryService";
import { config } from "@/common/configuratoins";
import { Chat, IMessage } from "@/types/IChat";
import { ChatMessageBubble } from "./ChatMessagBubble";
import { useSocket } from "@/contexts/SocketContext";
import { ClipLoader } from "react-spinners";
import { RootState } from "@/redux/store";
import { useParams } from "react-router-dom";

type MessageFile = {
  url: string;
  type: string;
};

const ChatPage: React.FC = () => {
  const { chatType } = useParams<{ chatType: string }>();
  const { data } = useSelector((state: RootState) => state.user);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<
    { url: string; type: string }[]
  >([]);

  const [inputValue, setInputValue] = useState("");
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageFiles, setMessageFiles] = useState<MessageFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<number | null>(
    null
  );
  const [showRecordingPopup, setShowRecordingPopup] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [chatData, setChatData] = useState([]);
  // const participantsArray = chatData.map(chat => chat.participants);
  // console.log(chatData,'mmmmmmmmmmmmmmmmmmmmmmmmmmmm');

  const [newChatAdded, setNewChatAdded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChatName, setSelectedChatName] = useState<string | null>(null);
  const [selectedChatprofileImage, setSelectedChatProfileImage] = useState<
    string | null
  >(null);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const { socket } = useSocket();
  // const socket=mediaSocketService;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // console.log(
  //   chatMessages,
  //   "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  // );

  const currentUser = data;
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (typing) {
        if (socket) {
          socket.emit("stopTyping", {
            roomId: selectedChatId,
            sender: currentUserId,
          });
          setTyping(false);
        }
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [chatMessages, typing, selectedChatId, socket, currentUserId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message: IMessage) => {
        console.log(message, "00000000000000000000");
        setChatMessages((prevMessages) => [...prevMessages, message]);
      };
      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.disconnect();
      };
    }
  }, [socket]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!typing) {
      setTyping(true);

      if (socket && selectedChatId) {
        socket.emit("typing", {
          roomId: selectedChatId,
          sender: currentUserId,
        });
      }
    }
  };

  const handleAttachmentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // fetching all the chats to display

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        const response = await CLIENT_API.get(`/media/get-all-chats/${currentUserId}`, config);
        const allchatData = response.data.chats;

        setChatData(allchatData);
      } catch (error) {
        console.error("Error fetching users", error);
        setChatData([]);
      } 
    };

    fetchAllChats();
  }, [newChatAdded]);

  useEffect(() => {
    const fetchAllChatMessages = async () => {
      try {
        if (isChatOpen) {
          const response = await CLIENT_API.get(
            `/media/get-all-messages?chatId=${selectedChatId}`,
            config
          );
          const allChatMessages = response.data.chatMessages;

          setChatMessages(allChatMessages);
          // console.log(allChatMessages);
        }
      } catch (error) {
        console.error("Error fetching messages", error);
        setChatMessages([]);
      }
    };

    fetchAllChatMessages();
  }, [isChatOpen, selectedChatId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() || messageFiles.length > 0 || audioBlob) {
      setInputValue("");
      setMessageFiles([]);
      setAudioBlob(null);
      setShowRecordingPopup(false);
      const currentUserId = currentUser?._id;
      const chatId = selectedChatId;

      const attachments = messageFiles.map((file) => ({
        url: file.url,
        type: file.type,
      }));

      const chatPayload = {
        content: inputValue || "",
        sender: currentUserId,
        attachments: attachments,
        chat: chatId,
      };

      try {
        const response = await CLIENT_API.post(
          "/media/send-message",
          chatPayload,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const sender = {
            _id: currentUser?._id || "",
            firstname: currentUser?.firstname || "",
            lastname: currentUser?.lastname || "",
            profileImage: currentUser?.profileImage || "",
          };

          const ChatsocketPayload = {
            _id: response.data.chatMessage._id,
            attachments: attachments,
            chat: chatId,
            content: inputValue || "",
            createdAt: new Date(),
            sender: sender,
          };
          if (socket) {
            socket.emit("newMessage", { obj: ChatsocketPayload });
          } else {
            console.error("Socket not connected yet, cannot emit message.");
          }

          setInputValue("");
          setMessageFiles([]);
          setAudioBlob(null);
          setShowPicker(false);
          setUploadedFileUrls([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node) &&
      anchorEl &&
      !anchorEl.contains(event.target as Node)
    ) {
      handleCloseMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleRemoveFilePreview = (index: number) => {
    if (uploadedFileUrls) {
      setUploadedFileUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      setUploadedFileUrls([]);
      setMessageFiles([]);
    }
  };

  const handlePhotoUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setFileUploadLoading(true);
      setMenuOpen(false);

      const files = Array.from(target.files);
      const previewUrls = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: "image",
      }));
      setUploadedFileUrls((prev) => [...prev, ...previewUrls]);

      try {
        const uploadedUrls = await uploadMultipleImages(files);
        const messageFilesToAdd = uploadedUrls.map((url) => ({
          url,
          type: "image",
        }));
        setMessageFiles((prev) => [...prev, ...messageFilesToAdd]);
      } catch (error) {
        console.error("Error uploading photo:", error);
      } finally {
        setFileUploadLoading(false);
      }
    }
  };

  const handleVideoUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setFileUploadLoading(true);
      const files = Array.from(target.files);
      const previewUrls = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: "video",
      }));
      setUploadedFileUrls((prev) => [...prev, ...previewUrls]);

      try {
        const uploadedUrls = await uploadMultipleVideos(files);
        const messageFilesToAdd = uploadedUrls.map((url) => ({
          url,
          type: "video",
        }));
        setMessageFiles((prev) => [...prev, ...messageFilesToAdd]);
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setFileUploadLoading(false);
      }
    }
  };

  const handleDocumentUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setFileUploadLoading(true);
      const files = Array.from(target.files);
      const previewUrls = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: "document", // Get the file type (e.g., application/pdf, etc.)
      }));
      setUploadedFileUrls((prev) => [...prev, ...previewUrls]);

      try {
        const uploadedUrls = await uploadMultipleDocuments(files);
        const messageFilesToAdd = uploadedUrls.map((url) => ({
          url,
          type: "document",
        }));
        setMessageFiles((prev) => [...prev, ...messageFilesToAdd]);
      } catch (error) {
        console.error("Error uploading document:", error);
      } finally {
        setFileUploadLoading(false);
      }
    }
  };

  const handleAudioRecord = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);

        setIsRecording(true);
        setShowRecordingPopup(true);
        setRecordingDuration(0);
        setFileUploadLoading(true);

        const audioChunks: Blob[] = [];
        mediaRecorderRef.current.start();

        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        const intervalId: number = window.setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
        setRecordingInterval(intervalId);

        mediaRecorderRef.current.addEventListener("stop", async () => {
          clearInterval(intervalId);
          setRecordingDuration(0);

          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioFile = new File([audioBlob], `audio_${Date.now()}.wav`, {
            type: "audio/wav",
          });

          setAudioBlob(audioBlob);

          try {
            const audioUrl = await uploadAudioFile(audioFile);
            // console.log(audioUrl, "Audio uploaded successfully");

            setMessageFiles((prevFiles) => [
              ...prevFiles,
              { url: audioUrl, type: "audio" },
            ]);
          } catch (error) {
            console.error("Error uploading audio:", error);
          } finally {
            setFileUploadLoading(false);
          }
        });
      } else {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);

        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
      }
    } catch (error) {
      console.error("Error accessing microphone or recording:", error);
    }
  };

  const handleChatOpen = (chatId: string, chat: Chat) => {
    setIsChatOpen(true);
    setSelectedChatId(chatId);

    if (socket && chatId) {
      socket.emit("joinRoom", chatId);
    }

    const chatName = chat.isGroupChat
      ? chat.name
      : chat.participants
          .filter((participant) => participant._id !== currentUserId)
          .map(
            (participant) => `${participant.firstname} ${participant.lastname}`
          )
          .join(", ");

    setSelectedChatName(chatName);

    const profileImage = chat.isGroupChat
      ? chat.groupIcon
      : chat.participants.filter(
          (participant) => participant._id !== currentUserId
        )[0]?.profileImage;

    setSelectedChatProfileImage(profileImage);
  };

  const handleDeleteAudio = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      setShowRecordingPopup(false);
      setAudioBlob(null);
    }
  };

  const renderChatHeader = () => {
    return (
      <div className="h-[9%] bg--400 flex border-b border-gray-200 dark:border-neutral-700">
        <div className="w-[70px] bg--500 h-full flex justify-center items-center ">
          <img
            src={selectedChatprofileImage || undefined}
            className="rounded-md object-cover  h-11 w-11 "
            alt=""
          />
        </div>
        <div className="w-[100%] bg--300 h-full flex p-2">
          <div className="w-[100%] bg--500 flex flex-col">
            <h1 className="text-base font-semibold text-gray-700 dark:text-white mt-2">
              {selectedChatName || "Full Name"}
            </h1>
            <h4 className="text-sm text-gray-600 dark:text-neutral-400">
              {typing ? "Typing..." : "All chats are encrypted"}
            </h4>
          </div>
          <div className="w-20px bg--400 flex justify-center items-center">
            <IoMdMore
              size={25}
              className="text-gray-500 hover:cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderContacts = () => {
    const contacts = chatData;
    const contactsAvailable = contacts.length > 0;
  
    if (chatType === "all-inbox" || chatType === "groups") {
      if (contactsAvailable) {
        return (
          <>
            {contacts.map((chat: Chat) => {
              const otherParticipant = chat.participants.find(
                (participant) => participant._id !== currentUserId
              );
  
              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatOpen(chat._id, chat)}
                >
                  <UserContact
                    profileImage={
                      chat.isGroupChat
                        ? chat.groupIcon
                        : otherParticipant?.profileImage ||
                          "https://res.cloudinary.com/djo6yu43t/image/upload/v1725124534/IMG_20240831_224439_v7rnsg.jpg"
                    }
                    fullName={
                      chat.isGroupChat
                        ? chat.name
                        : `${otherParticipant?.firstname ?? ''} ${otherParticipant?.lastname ?? ''}`
                    }
                    lastMessage={
                      chat.lastMessage ? chat.lastMessage : "No messages yet"
                    }
                  />
                </div>
              );
            })}
          </>
        );
      } else {
        return (
          <div className="flex justify-center items-center h-full">
            <p className="py-1 bg-slate-200 rounded-lg px-4 dark:bg-neutral-800 dark:text-white  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              No recent chat,{" "}
              <button className="text-blue-500 " onClick={handleOpenModal}>
                create a new chat.
              </button>
            </p>
          </div>
        );
      }
    }
  };
  
  

  return (
    <div className="dark:bg-neutral-900 w-full  flex h-[100%] relative">
      <div className="  contacts-listing scrollbar-custom bg--300  w-[35%] mt-4 border-r border-gray-100 dark:border-neutral-700 overflow-y-auto flex flex-col">
        <div className=" border-b  border-gray-200 dark:border-neutral-700">
          <ContactSearchBar />
          <div
            onClick={handleOpenModal}
            className="bg--400 flex justify-end items-center px-6 pt-2 pb-2 relative group"
          >
            <FiEdit
              className="cursor-pointer hover:text-thrive-blue dark:text-neutral-500"
              size={20}
            />
            <span className="tooltip opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bg-gray-500 text-white text-xs rounded py- 1 px-2 bottom-full ">
              Add chat
            </span>
          </div>
        </div>

        {renderContacts()}
      </div>

      <div
        className={`fixed inset-0 z-50 ${
          isModalOpen ? "flex" : "hidden"
        } justify-center items-center bg-black bg-opacity-50`}
      >
        <div className="w-[30%] h-auto bg-white rounded-lg ">
          <AddNewChatModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onNewChatAdded={() => setNewChatAdded((prev) => !prev)}
          />
        </div>
      </div>
      {isChatOpen ? (
        <div className="chat-listing  w-[100%] lg:w-[65%] relative flex flex-col">
          {renderChatHeader()}

          <div className="chat-listing bg--400 h-[87%] w-full scrollbar-custom">
            {/* <audio controls>
          <source src={audiofile} type="audio/ogg" />
  Your browser does not support the audio element.
</audio> */}

            <div className="flex bg-blue-50 dark:bg-neutral-950 flex-col-reverse space-y-3 pb-7 space-y-reverse p-4 overflow-y-auto h-full scrollbar-custom">
              <div ref={bottomRef} />
              {chatMessages &&
                chatMessages
                  .slice()
                  .reverse()
                  .map((message) => {
                    const isSender = message.sender._id === currentUserId;
                    return (
                      <ChatMessageBubble
                        key={message._id}
                        isSender={isSender}
                        message={message}
                        // isgroup={chatData.i}
                      />
                    );
                  })}
            </div>
          </div>
          {/* Preview Section */}
          <div
            className="flex  overflow-x-auto rounded-xl overflow-y-hidden  border-neutral-300 dark:border-neutral-600 shadow-xl bg-neutral-200 pr-20 dark:bg-neutral-700 scrollbar-custom mt-[-110px] relative z-50"
            style={{ width: "fit-content", minWidth: "100%" }}
          >
            <div className="flex flex-nowrap">
              {uploadedFileUrls.map((file, index) => (
                <div
                  key={index}
                  className="relative bg--400 border-r ml-2 dark:border-neutral-600 border-neutral-300 flex justify-center items-center flex-shrink-0"
                >
                  {file.type.startsWith("image") ? (
                    <img
                      src={file.url}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-md mr-2"
                    />
                  ) : file.type.startsWith("video") ? (
                    <video
                      src={file.url}
                      className="w-24 h-24 object-cover rounded-md mr-2"
                    />
                  ) : file.type === "document" ? (
                    <embed
                      src={file.url}
                      type={file.type}
                      width="100%"
                      height="100%"
                      className="w-24 h-24 object-cover rounded-md mr-2"
                    />
                  ) : (
                    <div className="w-24 h-24 flex justify-center items-center rounded-md mr-2">
                      <span className="text-lg">
                        {file.type.split("/")[1].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex justify-center items-center"
                    onClick={() => handleRemoveFilePreview(index)}
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleSendMessage}
            className="chat-input bg-white dark:bg-dark-bg h-[7%] w-[100%] bottom-0 absolute flex border-t border-gray-200 dark:border-neutral-700"
          >
            {/* Attachments and Inputs */}
            <div className="bg--400 h-full w-[7%] flex justify-center items-center">
              <div
                className="w-9 h-9 hover:bg-slate-100 dark:hover:bg-neutral-700 dark:text-white hover:cursor-pointer rounded-md flex justify-center items-center"
                onClick={handleAttachmentClick}
              >
                <GrAttachment size={19} />
              </div>
              <Menu
                anchorEl={anchorEl}
                className="mt-[-43px]"
                open={menuOpen}
                onClose={handleCloseMenu}
                PaperProps={{
                  style: {
                    width: "auto",
                    maxWidth: 200,
                    backgroundColor: "#909090",
                    top: "calc(100% + 5px)",
                    left: "auto",
                    right: 0,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = handlePhotoUpload;
                    fileInput.multiple = true;
                    fileInput.click();
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <MdPhotoCamera style={{ marginRight: 8 }} />
                  Upload Photo
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "video/*";
                    fileInput.onchange = handleVideoUpload;
                    fileInput.click();
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <MdVideoCall style={{ marginRight: 8 }} />
                  Upload Video
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = ".pdf,.doc,.docx,.txt";
                    fileInput.onchange = handleDocumentUpload;
                    fileInput.click();
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <MdAttachFile style={{ marginRight: 8 }} />
                  Upload Document
                </MenuItem>
              </Menu>
            </div>
            <div className="bg-400 h-full w-[82%] flex justify-center items-center p-2">
              <input
                value={inputValue}
                onChange={handleInputChange}
                className="w-full h-full bg--400 dark:bg-dark-bg rounded-md dark:text-white focus:outline-none"
              />
            </div>
            {/* Send Button with Loading */}
            <div className="bg--400 h-full w-[13%] flex items-center justify-around">
              <div
                className="w-9 h-9 dark:hover:bg-neutral-700 dark:text-white hover:bg-slate-100 hover:cursor-pointer rounded-md flex justify-center items-center"
                onClick={() => setShowPicker((prev) => !prev)}
              >
                <FaRegFaceSmile size={19} />
              </div>
              {showPicker && (
                <div
                  className="absolute bottom-[7%] mb-10 right-40 z-50 w-[30%]"
                  ref={pickerRef}
                >
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <div className="flex items-center">
                {inputValue.trim() || messageFiles.length > 0 || audioBlob ? (
                  <div>
                    {fileUploadLoading ? (
                      <button
                        disabled={fileUploadLoading}
                        className="w-9 h-9 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 hover:cursor-pointer rounded-md"
                      >
                        <ClipLoader
                          size={20}
                          speedMultiplier={0.8}
                          color="dark:text-neutral-300 text-neutral-600"
                        />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={fileUploadLoading}
                        className="w-9 h-9 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-700 hover:cursor-pointer rounded-md"
                      >
                        <TbSend2 size={23} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-9 h-9 dark:hover:bg-neutral-700 dark:text-white hover:bg-slate-100 hover:cursor-pointer rounded-md flex justify-center items-center"
                    onClick={handleAudioRecord}
                  >
                    {isRecording ? (
                      <GrMicrophone size={19} className="text-red-500" />
                    ) : (
                      <GrMicrophone size={19} />
                    )}
                  </div>
                )}
              </div>
              {showRecordingPopup && (
                <div className="absolute bottom-[7px] right-28 transform dark:bg-neutral-700 dark:text-white bg-neutral-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:shadow-neutral-600 dark:border-neutral-600 rounded-xl p-2 flex items-center">
                  <div
                    className="mr-2 cursor-pointer"
                    onClick={handleDeleteAudio}
                  >
                    <HiTrash />
                  </div>
                  <div className="mr-3 text-red-400">
                    Recording.... {recordingDuration}s
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="h-full w-[100%] lg:w-[65%] dark:bg-dark-bg dark:text-white flex justify-center items-center">
          <div className="no-contacts justify-center flex items-center  w-full bg--400 h-full">
            <p className="py-1 bg-slate-200 rounded-lg px-4 dark:bg-neutral-800 dark:text-white  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0 px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
