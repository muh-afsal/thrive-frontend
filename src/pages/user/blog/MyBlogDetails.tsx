/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CLIENT_API } from "@/axios";
import { ArrowLeft, EllipsisVertical, ArrowRight } from "lucide-react";
import { Heart, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FaRegFaceSmile } from "react-icons/fa6";
import Picker from "emoji-picker-react";
import { TbSend2 } from "react-icons/tb";
import EditBlogModal from "./EditBlogModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { config } from "@/common/configuratoins";

const MyBlogDetail: React.FC = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<any | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const { data } = useSelector((state: RootState) => state.user);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [showMessagePanel, setShowMessagePanel] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const emojiPickerRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate=useNavigate()

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const currentUserId = data?._id;

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const onEmojiSelect = (emojiObject: any) => {
    setCommentInput((prev) => prev + emojiObject.emoji);
  };

 
  const handleConfirm = async() => {
    setIsModalOpen(false);

    try {
      await CLIENT_API.delete(`/media/remove-blog/${blogId}`, config);
      navigate(`/blog/my-blogs`)
    } catch (error) {
      console.error("Error adding comment via API:", error);
      throw new Error("Comment API request failed");
    }


    
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendComment = async () => {
    if (commentInput.trim()) {
      const NewBlogData = {
        blogId: blogId,
        author: currentUserId,
        comment: commentInput,
        like: false,
      };

      try {
        await CLIENT_API.post("/media/add-blog", NewBlogData);
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error adding comment via API:", error);
        throw new Error("Comment API request failed");
      }

      setCommentInput("");
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await CLIENT_API.get(`/media/get-blog/${blogId}`);
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching the blog", error);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, refresh]);

  const handleLikeBlog = async () => {
    const NewBlogData = {
      blogId: blogId,
      author: currentUserId,
      like: true,
    };

    try {
      await CLIENT_API.post("/media/add-blog", NewBlogData);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error adding new blog via API:", error);
      throw new Error("Blog API request failed");
    }
  };

 

  const handleEditBlog = () => {
    setIsEditModalOpen(true);
  };

  const toggleMessagePanel = () => {
    setShowMessagePanel((prev) => !prev);
    
  };

  function timeAgo(dateString: string): string {
    const date: Date = new Date(dateString);
    const now: Date = new Date();

    const seconds: number = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
    const months: number = Math.floor(days / 30);
    const years: number = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }

  if (loading) {
    return <p>Loading blog...</p>;
  }

  if (!blog) {
    return (
      <div className="text-center mt-10 flex flex-col h-full justify-center items-center">
        <h2 className="text-2xl font-semibold dark:text-neutral-300">
          Oops! We couldn't find the blog you're looking for.
        </h2>
        <p className="mt-4 dark:text-neutral-500">
          It might have been removed or there was a network issue while
          fetching the blog details. Please check back later or try again.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 text-white py-2 flex gap-2 items-center justify-around px-4 rounded hover:bg-blue-700 transition"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="lg:px-[25%] p-5 bg--800 pt-10 gap-7 min-h-full flex justify-center flex-col">
      <h2 className="text-4xl font-bold dark:text-neutral-300 text mb-5">
        {blog.heading}
      </h2>
      <div className="mt-3 flex items-center">
        <div className="flex items-center bg--500 w-full ">
          <div className="flex items-center w-[50%]">
            <div
              className="w-8 h-8 rounded-full bg-cover bg-center bg--400"
              style={{ backgroundImage: `url(${blog.author.profileImage})` }}
            />
            <h3 className="ml-3 text-neutral-500 text-sm dark:text-neutral-400">
              {blog.author.firstname} {blog.author.lastname}
            </h3>
          </div>
          <div className="bg--400 w-[50%] dark:text-neutral-400 text-neutral-700 flex gap-8 md:gap-20 justify-end py-2">
            <span className="flex gap-1 cursor-pointer">
              <Heart
                size={20}
                onClick={handleLikeBlog}
                className={
                  blog.likes.includes(currentUserId)
                    ? "text-red-500"
                    : "text-neutral-400"
                }
                fill={blog.likes.includes(currentUserId) ? "red" : "none"}
              />
              <p className="text-sm flex items-center">{blog.likes.length}</p>
            </span>

            <span
              className="flex gap-1 cursor-pointer"
              onClick={toggleMessagePanel}
            >
              <MessageCircle size={20} />
              <p className="text-sm flex items-center">
                {blog.comments.length}
              </p>
            </span>

            <span
              onClick={toggleDropdown}
              className="flex gap-1 dark:hover:text-neutral-200 cursor-pointer relative"
              ref={dropdownRef}
            >
              <EllipsisVertical size={20} />
              {isOpen && (
                <div className="absolute right-0 mt-8 w-48 bg-neutral-200 border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 rounded shadow-lg z-10">
                  <ul className="py-2">
                    <li
                      onClick={handleEditBlog}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      Edit Blog
                    </li>
                    <li
                       onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      Delete Blog
                    </li>
                  </ul>
                </div>
              )}
            </span>
            {isModalOpen && (
            <ConfirmationModal
              onClose={handleClose}
              onConfirm={handleConfirm}
              size="md:w-96"
            />
          )}
          </div>
        </div>
      </div>
      <p className="text-sm mt-3 dark:text-neutral-400 text-neutral-500">
        {timeAgo(blog.createdAt)}
      </p>
      <div className="w-full flex justify-center">
        {blog.attachment && blog.attachmentType && (
          <>
            {blog.attachmentType === "image" && (
              <div
                className="w-[100%] h-[400px] rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.attachment})` }}
              ></div>
            )}
            {blog.attachmentType === "video" && (
              <video
                className="w-[100%] h-[400px] bg-neutral-300 rounded-lg"
                controls
              >
                <source src={blog.attachment} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        )}
      </div>
      <p className="mt-5 dark:text-neutral-500 text-xl leading-[50px] font-sans">
        {blog.content}
      </p>
      {/* Message Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[350px] lg:w-[400px]  rounded-lg shadow-[inset_0px_0px_7px_0px_#D3D3D3] dark:shadow-[inset_0px_0px_7px_0px_#000000] bg-white dark:bg-dark-bg transition-transform duration-300 transform z-50 ${
          showMessagePanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between px-9 py-[25px] ">
          <h3 className="text-lg font-semibold">Comments(80)</h3>
          <button onClick={toggleMessagePanel} className="text-lg">
            <ArrowRight />
          </button>
        </div>
        <div className="px-3 h-full ">
          <div className=" border-b border-neutral-300 dark:border-neutral-700">
            {/* Comment Input Section */}
            <div className="flex justify-between items-center p-3 border-t border-neutral-300 dark:border-neutral-700">
              <div className="bg-400 h-full w-[80%] flex justify-center items-center p-2">
                <input
                  value={commentInput}
                  onChange={handleCommentInputChange}
                  className="w-full h-full bg--400 dark:bg-dark-bg rounded-md dark:text-white focus:outline-none"
                  placeholder="Add a comment..."
                />
              </div>

              <div className="flex items-center">
                <div
                  className="w-9 h-9 dark:hover:bg-neutral-700 dark:text-white hover:bg-slate-100 hover:cursor-pointer rounded-md flex justify-center items-center"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <FaRegFaceSmile size={19} />
                </div>
                {showEmojiPicker && (
                  <div
                    className="absolute top-36 right-72 z-50 w-[20%]"
                    ref={emojiPickerRef}
                  >
                    <Picker onEmojiClick={onEmojiSelect} />
                  </div>
                )}
              </div>

              <div className="flex items-center ml-2">
                <button
                  type="submit"
                  onClick={handleSendComment}
                  className="w-9 h-9 dark:text-white hover:bg-slate-100 flex justify-center items-center dark:hover:bg-neutral-700 hover:cursor-pointer rounded-md"
                >
                  <TbSend2 size={23} />
                </button>
              </div>
            </div>
          </div>
          <div className="h-[83%] px-3 overflow-auto scrollbar-custom">
            {blog.comments.sort((a: any, b: any) => new Date(b.commentedOn).getTime() - new Date(a.commentedOn).getTime()).map((comment: any, index: number) => (
              <div
                key={index}
                className="mb-2 min-h-10 flex flex-col items-center border-b border-neutral-200 dark:border-neutral-700"
              >
                <div className="h-[50px] w-full flex gap-3 items-center">
                  <div className="flex  items-center w-full px-3 gap-4">
                    <div
                      className={`h-9 w-9 mt-1 bg--300 rounded-full overflow-hidden `}
                    >
                      <img
                        src={comment.commentor.profileImage}
                        alt="Profile Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-300">
                        {comment.commentor.firstname}{" "}
                        {comment.commentor.lastname}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {timeAgo(comment.commentedOn)}
                      </p>
                    </div>
                  </div>
                  <div>
                  <EllipsisVertical size={19} className="text-neutral-500 dark:text-neutral-700" />
                  </div>
                </div>
                <div className=" min-h-9 w-full items-center px-5 py-3">
                   <p className="font-normal  text-base dark:text-neutral-300 text-neutral-700 "> {comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditBlogModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          blogData={blog}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default MyBlogDetail;
