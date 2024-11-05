import React, { useRef, useEffect, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

interface MediaStreamDisplayProps {
  stream: MediaStream | null;
  profilePicture?: string;
  userName?: string;
  onRemoveUser?: () => void; // Function to handle user removal
}

const MediaStreamDisplay: React.FC<MediaStreamDisplayProps> = ({
  stream,
  profilePicture,
  userName,
  onRemoveUser,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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

  return (
    <div className="w-full h-full relative flex justify-center items-center">
      {/* Video stream */}
      <video
        className="bg-neutral-700 rounded-lg h-full"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          transform: "scaleX(-1)",
        }}
      />
      
      <div className="absolute top-2 right-2">
        <div onClick={toggleDropdown} className="cursor-pointer">
          <MdMoreVert size={24} className="text-white" />
        </div>
        {isDropdownVisible && (
          <div className="absolute right-0 mt-2 w-40 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-neutral-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-white"
                  onClick={() => {
                    setIsDropdownVisible(false);
                    if (onRemoveUser) onRemoveUser();
                  }}
                >
                  Remove User
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MediaStreamDisplay);
