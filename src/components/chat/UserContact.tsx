
import { IoMdMore } from "react-icons/io";

interface UserContactProps {
  profileImage: string;
  fullName: string;
  lastMessage: string;
}

const UserContact: React.FC<UserContactProps> = ({ profileImage, fullName, lastMessage }) => {
  return (
    <div className="h-[70px] w-full dark:hover:bg-neutral-800 hover:bg-neutral-200 bg--400 flex border-b border-gray-100 dark:border-neutral-700">
      <div className="w-[70px] bg--500 h-full flex justify-center items-center ">
        <img src={profileImage} className="rounded-md border border-neutral-300 dark:border-neutral-600 object-cover bg--400 h-11 w-11" alt={fullName} />
      </div>
      <div className="w-[100%] bg--300 h-full flex p-2">
        <div className="w-[100%] bg--500">
          <h1 className="text-lg text-gray-700 dark:text-white">{fullName}</h1>
          <h4 className="text-sm text-gray-600 dark:text-neutral-400">{lastMessage}</h4>
        </div>
        <div className="w-20px bg--400">
          <IoMdMore size={22} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default UserContact;
