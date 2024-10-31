/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CLIENT_API } from "@/axios"; 
import { Link } from "react-router-dom";

import { RootState } from "@/redux/store";
import BlogContainer from "@/components/blog/BlogContainer";
import { ArrowLeft } from "lucide-react";

const MyBlog: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.user);
  const userId = data?._id; 
  const [blogData, setBlogData] = useState([]); 



 

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await CLIENT_API.get(`/media/get-myblogs/${userId}`); 
        setBlogData(response.data.blogs);
      } catch (error) {
        console.error("Error fetching user's blogs:", error);
      }
    };

    if (userId) {
      fetchUserBlogs();
    }
  }, [userId]);

  return (
    <div>
      <div className="w-full bg--500 h-[100%]">
        <div className="w-full flex justify-center ">

           <h1 className="w-full text-center h-full  font-bold md:text-2xl text-xl md:py-4 py-2 border-b border-neutral-400 dark:border-neutral-700  md:w-[80%]">Your Blogs</h1>
        </div>
        <div className="w-full flex justify-center items-center ">
          <div className="lg:w-[70%] bg--500 w-full md:w-[80%] bg--400 h-[84vh] overflow-x-auto scrollbar-custom pt-1 rounded-lg ">
            

            {blogData && blogData.length > 0 ? (
              blogData.map((blog: any) => (
                <Link to={`/blog/my-blog/${blog._id}`} className="w-full h-[50%] px-5"> <BlogContainer key={blog._id} blog={blog} />  </Link>
              ))
            ) : (
              <div className="text-center  flex flex-col h-full justify-center items-center">
              <h2 className="text-2xl font-semibold dark:text-neutral-300">
                Oops! We couldn't find any of Your Blog.
              </h2>
              <p className="mt-4 dark:text-neutral-500">
                You may have not posted any Blog yet or there was any Network issue while
                fetching the blog details. Please check back later or try again.
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-6 bg-blue-600 text-white py-2 flex gap-2 items-center justify-around px-4 rounded hover:bg-blue-700 transition"
              >
                <ArrowLeft size={20} /> Go Back
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>  
  );
};

export default MyBlog;
