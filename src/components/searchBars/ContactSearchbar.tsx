import { FaSearch } from "react-icons/fa";

const ContactSearchBar: React.FC = () => {
  return (
    <div className="bg--200 h-[40px] w-full flex   items-center justify-between px-4 my-2">
      <input
        type="text"
        placeholder="Search contacts"
        className="w-full h-[35px]  dark:bg-neutral-800 dark:border-neutral-600 dark:text-white px-4 outline-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-white rounded-l-lg"
      />
      <div className="h-[35px] flex items-center  dark:bg-neutral-800 dark:border-neutral-600  bg-white px-4 rounded-r-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <FaSearch size={18} className="text-gray-600 dark:text-neutral-500" />  
      </div>
    </div>
  );
};

export default ContactSearchBar;
