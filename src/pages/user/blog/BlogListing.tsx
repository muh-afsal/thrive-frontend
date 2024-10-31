/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import BlogContainer from "@/components/blog/BlogContainer";
import { CLIENT_API } from "@/axios";
import { Link } from "react-router-dom";

const BlogListing: React.FC = () => {
  const [blogData, setBlogData] = useState<any>([]);

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        const response = await CLIENT_API.get("/media/get-all-blogs");
        const allBlogData = response.data.blogs;
        setBlogData(allBlogData);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };

    fetchAllChats();
  }, []);

  return (
    <div className="w-full bg--500 h-[100%]">
      <div className="w-full flex justify-center items-center">
        <div className="lg:w-[70%] w-full md:w-[80%] h-[84vh] overflow-x-auto scrollbar-custom pt-1 rounded-lg">
          {blogData && blogData.length > 0 ? (
            blogData.map((blog: any) => (
              <Link to={`/blog/all-blogs/${blog._id}`} key={blog._id} className="w-full h-[50%] px-5">
                <BlogContainer blog={blog} />
              </Link>
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
