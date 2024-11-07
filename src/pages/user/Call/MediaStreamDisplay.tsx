/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/contexts/SocketContext";
import { RootState } from "@/redux/store";
import React, { useRef, useEffect, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import { useSelector } from "react-redux";

interface MediaStreamDisplayProps {
  stream: MediaStream | null;
  profilePicture?: string;
  userName?: string;
  userId: any | undefined;
  roomId: string | undefined;
  removeRemoteStream?: (userId: any) => void;
  endcall?: () => void;
}

const MediaStreamDisplay: React.FC<MediaStreamDisplayProps> = ({
  stream,
  profilePicture,
  userName,
  userId,
  roomId,
  removeRemoteStream,
  endcall
}) => {
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  // const [host, setHost] = useState<string | null>(null);
  const hostRef = useRef<string | null>(null);
  console.log(hostRef.current,'lllllllllllllllllllllllll');
  

  const { socket } = useSocket();
  const { data } = useSelector((state: RootState) => state.user);
  const currentUserId = data?._id;

  useEffect(() => {
    socket?.on("host-users", ({ host }) => {
      if (!hostRef.current) {
        hostRef.current = host;
      } 
    });
    socket?.on("user-removed", () => {
      endcall?.(); 
    });
    socket?.on("user-removed-from-room", ({ userId }) => {
      removeRemoteStream?.(userId); 
    });

    return () => {
      socket?.off("host-users");
      socket?.off("user-removed");
      socket?.off("user-removed-from-room");
    };
  }, [socket]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && stream) {
      videoElement.srcObject = stream;
    }
    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [stream]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleRemoveUser = () => {
    setIsDropdownVisible(false);
    socket?.emit("remove-user", {
      roomId: roomId,
      userIdToRemove: userId,
    });
  };

  if (!stream) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={userName}
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center mb-2">
            <span className="text-white">No Image</span>
          </div>
        )}
        {userName && <p className="text-lg text-white">{userName}</p>}
      </div>
    );
  }

  const renderRemoteUser = () => {
    return (
      <div className="w-full h-full relative flex justify-center items-center">
        <video
          className="bg-neutral-700 rounded-lg h-full"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: "scaleX(-1)",
          }}
        />
        {/* {hostRef.current === currentUserId && ( */}
          <div className="absolute top-2 right-2">
            <div onClick={toggleDropdown} className="cursor-pointer">
              <MdMoreVert size={24} className="text-white" />
            </div>
            {isDropdownVisible && (
              <div className="absolute top-10 right-0 bg-neutral-800 text-white py-1 w-40 rounded-lg shadow-lg z-10">
                <button
                  className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700"
                  onClick={handleRemoveUser}
                >
                  Remove User
                </button>
              </div>
            )}
          </div>
        {/* )} */}
      </div>
    );
  };

  const renderCurrentUserStream = () => {
    return (
      <div className="w-full h-full relative flex justify-center items-center">
        <video
          className="bg-neutral-700 rounded-lg h-full"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: "scaleX(-1)", 
          }}
        />
      </div>
    );
  };

  if (userId !== currentUserId) {
    return renderRemoteUser();
  }

  return renderCurrentUserStream();
};

export default MediaStreamDisplay;
