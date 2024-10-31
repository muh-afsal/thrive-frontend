/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { CLIENT_API } from "@/axios";
import { config } from "@/common/configuratoins";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { FaCamera } from "react-icons/fa";
import cloudinaryimageUpload from "../../utils/cloudinary/cloudinaryService";

interface AddNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChatAdded: () => void; 
}

const AddNewChatModal: React.FC<AddNewChatModalProps> = ({
  isOpen,
  onClose,
  onNewChatAdded
}) => {
  const [toggleView, setToggleView] = useState<"chat" | "group">("chat");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [groupIcon, setGroupIcon] = useState<string | null>(null);
  const { data } = useSelector((state: RootState) => state.user);


  const currentUser = data;

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) return;
      setIsLoading(true);
      try {
        const response = await CLIENT_API.get(
          `/media/search-users?query=${encodeURIComponent(searchTerm)}   `,
          config
        );
        const UsersData = response.data.users;
        const filteredUsers = UsersData.filter(
          (user: any) => user._id !== currentUser?._id
        );

        setSearchResults(Array.isArray(filteredUsers) ? filteredUsers : []);
      } catch (error) {
        console.error("Error fetching users", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, currentUser?._id]);

  const handleToggle = (view: "chat" | "group") => {
    setToggleView(view);
    setSearchResults([]);
    setSearchTerm("");
    setSelectedUser(null);
    setSelectedParticipants([]);
    setGroupName("");
    setGroupIcon(null);
  };

  const handleParticipantSelection = (user: any) => {
    if (toggleView === "chat") {
      setSelectedUser(user);
      setSearchTerm(`${user.firstname} ${user.lastname}`);
    } else {
      if (
        selectedParticipants.some((participant) => participant._id === user._id)
      ) {
        removeParticipant(user._id);
      } else {
        setSelectedParticipants((prev) => [...prev, user]);
      }
    }
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.filter((participant) => participant._id !== userId)
    );
  };



  const handleCreateChat = async () => {
    const selectedUserId = selectedUser?._id;
    const currentUserId = currentUser?._id;
    if (!selectedUser) {
      alert("Please select a user to chat with.");
      return;
    }
    const payload = {
      selectedUserId: selectedUserId,
      currentUserId: currentUserId,
    };

    try {
      const response = await CLIENT_API.post("/media/create-chat", payload, {
        withCredentials: true,
      });
      if (response.data.success) {
        onNewChatAdded();
        onClose();
        setToggleView("chat");
        setSearchTerm("");
        setSearchResults([]);
        setSelectedParticipants([]);
        setGroupName("");
        setSelectedUser(null);
        setGroupIcon(null);
      }
    } catch (error) {
      console.log(error);
    }
  };





  // funciton to create the group chat 
  const handleCreateGroup = async () => {
    if (!groupName || selectedParticipants.length < 2) {
      alert("Please enter a group name and select at least 3 participants.");
      return;
    }
    const currentUserId = currentUser?._id;
    const participants = [
      ...selectedParticipants.map((user) => user._id),
      currentUserId,
    ];
    const groupData = {
      name: groupName,
      participants,
      groupIcon,
      currentUserId,
    };
    console.log(groupData,'lllllllllllllllllllllllllllllllllll');
    
    try {
      const response = await CLIENT_API.post(
        "/media/create-group-chat",
        groupData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        onNewChatAdded();
        onClose();
        setToggleView("chat");
        setSearchTerm("");
        setSearchResults([]);
        setSelectedParticipants([]);
        setGroupName("");
        setSelectedUser(null);
        setGroupIcon(null);
      }
    } catch (error) {
      console.log(error);
    }

    console.log("Creating a new group", {
      groupName,
      selectedParticipants,
      groupIcon,
    });
  };

  
  const handleGroupIconChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const localUrl = URL.createObjectURL(file);
      // setGroupIcon(localUrl);

      try {
        const cloudinaryUrl = await cloudinaryimageUpload(file);
        setGroupIcon(cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
      } finally {
        URL.revokeObjectURL(localUrl);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "flex" : "hidden"
      } justify-center items-center bg-black bg-opacity-50 `}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md"
      >
        <div className="rounded-lg w-full h-12 border border-neutral-200 dark:border-neutral-700 shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex flex-row justify-around items-center mb-6">
          <button
            className={`w-[45%] h-[80%] rounded-md ${
              toggleView === "chat"
                ? "bg-thirve-blue"
                : "bg-white dark:bg-neutral-800"
            }`}
            onClick={() => handleToggle("chat")}
          >
            <p
              className={`${
                toggleView === "chat"
                  ? "text-white"
                  : "text-black dark:text-white"
              }`}
            >
              Chat
            </p>
          </button>
          <button
            className={`w-[45%] h-[80%] rounded-md ${
              toggleView === "group"
                ? "bg-thirve-blue"
                : "bg-white dark:bg-neutral-800"
            }`}
            onClick={() => handleToggle("group")}
          >
            <p
              className={`${
                toggleView === "group"
                  ? "text-white"
                  : "text-black dark:text-white"
              }`}
            >
              Group
            </p>
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {toggleView === "chat"
            ? "Create Individual Chat"
            : "Create New Group"}
        </h2>

        {toggleView === "group" && (
          <div className="create-group-section mt-4 ">
            <div
              className={`relative dark:bg-neutral-600  flex justify-center items-center p-2 rounded-lg w-full border border-dashed dark:border-neutral-400 border-gray-200 cursor-pointer ${
                groupIcon ? "bg-transparent" : "bg-slate-100"
              } mb-4`}
              onClick={() => document.getElementById("groupIconInput")?.click()}
            >
              <input
                type="file"
                id="groupIconInput"
                accept="image/*"
                onChange={handleGroupIconChange}
                className="hidden "
              />
              {!groupIcon && (
                <div className="flex items-center  w-full pl-5 ">
                  <div className=" bg-gray-300 p-2 rounded-full mr-4">
                    <FaCamera className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="w-[100%] ">
                    <span className="text-gray-500 dark:text-neutral-400">
                      Upload Group Icon (Optional)
                    </span>
                  </div>
                </div>
              )}
              {groupIcon && (
                <img
                  src={groupIcon}
                  alt="Group Icon Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 mb-1 w-full focus:outline-none focus:border-blue-200"
            />
          </div>
        )}
        <div className="create-section">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              toggleView === "chat" ? "Search users" : "Search users to add"
            }
            className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md p-2 mb-4 w-full focus:outline-none focus:border-blue-200"
          />
          {isLoading && <p>Loading...</p>}

          {searchResults.length > 0 && (
            <ul className="border border-gray-300 dark:border-neutral-500 rounded-md max-h-40 overflow-auto">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleParticipantSelection(user)}
                  className={`p-2 hover:bg-gray-200 dark:bg-neutral-400 dark:hover:bg-neutral-200 cursor-pointer ${
                    toggleView === "group" &&
                    selectedParticipants.some(
                      (participant) => participant._id === user._id
                    )
                      ? "bg-gray-300"
                      : ""
                  }`}
                >
                  {user.firstname} {user.lastname}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="selected-participants mt-2 flex flex-wrap">
          {selectedParticipants.map((participant) => (
            <span
              key={participant._id}
              className="p-1 bg-gray-200 dark:bg-neutral-500 rounded mr-2 inline-flex items-center"
            >
              {participant.firstname} {participant.lastname}
              <button
                className="ml-2 text-black dark:text-white flex justify-center items-center"
                onClick={() => removeParticipant(participant._id)}
              >
                <IoCloseCircleOutline />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
        <button
            onClick={onClose}
            className="bg-neutral-600 text-white mr-2 px-4 py-1 rounded-lg hover:bg-neutral-500 transition duration-200"
          >
            Cancel
          </button>
          {toggleView === "chat" ? (
            <button
              onClick={handleCreateChat}
              className="bg-thirve-blue text-white px-4 py-1 rounded-lg hover:bg-blue-400 transition duration-200"
            >
              Create Chat
            </button>
          ) : (
            <button
              onClick={handleCreateGroup}
              className="bg-thirve-blue text-white px-4 py-1 rounded-lg hover:bg-blue-400 transition duration-200"
            >
              Create Group
            </button>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default AddNewChatModal;
