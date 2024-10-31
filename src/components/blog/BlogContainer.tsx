/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisVertical, Heart, MessageCircle } from "lucide-react";
import React from "react";
interface BlogProps {
  blog: {
    likes: any;
    _id: string;
    author: {
      firstname: string;
      lastname: string;
      email: string;
      profileImage: string;
    };
    heading: string;
    content: string;
    createdAt: string;
    comments: any[];
    topic: string;
    isBlocked: boolean;
    thumbnail: string | null;
  };
}

const BlogContainer: React.FC<BlogProps> = ({ blog }) => {
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

  return (
    <>
      <div className="h-[300px] border-b dark:border-neutral-800 border-neutral-200 px-5 w-full flex">
        <div className="bg--300 w-8/12 h-full">
          <div className=" flex mb-6">
            <div className="w-full h-[25%]  flex items-center">
              <img
                src={blog.author.profileImage}
                alt="Author"
                className="w-8 h-8 rounded-full ml-3 bg-neutral-500"
              />
              <h3 className="dark:text-neutral-400 text-neutral-500 text-sm ml-3">
                {blog.author.firstname} {blog.author.lastname}
              </h3>
            </div>
            <p className="text-sm  md:w-[200px] w-[150px] flex justify-center items-center dark:text-neutral-400 text-neutral-500">
              {timeAgo(blog.createdAt)}
            </p>
          </div>
          <h1 className="text-2xl font-bold line-clamp-2 dark:text-neutral-300">
            {blog.heading}
          </h1>
          <p className="line-clamp-3 mt-4 dark:text-neutral-500">
            {blog.content}
          </p>
          <div className="w-full bg--300 h-[25%] flex">
            <div className="min-w-[50%] h-full bg--500 flex gap-12 text-neutral-700 dark:text-neutral-400 items-end pl-8 pb-4">
              <span className="flex gap-1">
                <Heart size={20} />
                <p className="text-sm flex items-center">{blog.likes.length}</p>
              </span>
              <span className="flex gap-1">
                <MessageCircle size={20} />
                <p className="text-sm flex items-center">
                  {blog.comments.length}
                </p>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-4/12 h-full">
          <div className="bg--600 w-full h-full flex flex-col justify-center relative lg:static items-start md:items-center">
            {blog.thumbnail ? (
              <div
                className="  rounded-lg  bg-cover bg-center lg:w-[260px] lg:h-[180px] xl:w-[300px] xl:h-[180px] top-0 absolute lg:static h-[100px] md:h-[120px] md:w-[220px] w-[150px] mt-10 md:mt-0 "
                style={{ backgroundImage: `url(${blog.thumbnail})` }}
              ></div>
            ) : (
              <span></span>
            )}
          </div>
          <div className="bg--500 h-12 flex dark:text-neutral-400 justify-end pr-5 bottom-0">
            <EllipsisVertical />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogContainer;
