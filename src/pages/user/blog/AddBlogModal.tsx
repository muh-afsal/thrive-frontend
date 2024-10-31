import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoCloseCircleOutline } from "react-icons/io5";
import cloudinaryimageUpload, {
  uploadSingleVideo,
} from "../../../utils/cloudinary/cloudinaryService";
import CircularProgress from "@mui/material/CircularProgress";
import { Image } from "lucide-react";
import { MonitorPlay } from "lucide-react";
import { CLIENT_API } from "@/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

interface AddBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  heading: Yup.string().trim().required("Heading is required"),
  content: Yup.string().trim().required("Content is required"),
});

const AddBlogModal: React.FC<AddBlogModalProps> = ({ isOpen, onClose }) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<"image" | "video">(
    "image"
  );
  const navigate=useNavigate()
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data } = useSelector((state: RootState) => state.user);
  const currentUserId = data?._id;

  const formik = useFormik({
    initialValues: {
      heading: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        let uploadedUrlThumbnail: string | null = null;
        if (thumbnail) {
          try {
            uploadedUrlThumbnail = await cloudinaryimageUpload(thumbnail);
          } catch (error) {
            console.error("Error uploading thumbnail to Cloudinary:", error);
            throw new Error("Thumbnail upload failed");
          }
        }

        let uploadedUrlAttachment: string | null = null;
        if (attachment) {
          try {
            if (attachmentType === "image") {
              uploadedUrlAttachment = await cloudinaryimageUpload(attachment);
            } else if (attachmentType === "video") {
              uploadedUrlAttachment = await uploadSingleVideo(attachment);
            }
          } catch (error) {
            console.error(
              `Error uploading ${attachmentType} to Cloudinary:`,
              error
            );
            throw new Error(`${attachmentType} upload failed`);
          }
        }

        const NewBlogData = {
          ...values,
          thumbnail: uploadedUrlThumbnail || null,
          attachmentType,
          author:currentUserId,
          attachment: uploadedUrlAttachment || null,
        };

        try {
        await CLIENT_API.post(
            "/media/add-blog",
            NewBlogData
          );

        } catch (error) {
          console.error("Error adding new blog via API:", error);
          throw new Error("Blog API request failed");
        }
      } catch (error) {
        console.error("Error during blog upload process:", error);
      } finally {
        navigate(`/blog`)
        setIsLoading(false);
        handleClose();
      }
    },
  });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setPreviewUrl(null);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment(file);
      setAttachmentPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentPreviewUrl(null);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleClose = () => {
    setThumbnail(null);
    setAttachmentType("image");
    setAttachment(null);
    setPreviewUrl(null);
    setAttachmentPreviewUrl(null);
    formik.resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto scrollbar-custom">
      <div className="bg-white dark:bg-neutral-800 dark:text-neutral-200 rounded-lg shadow-lg w-full max-w-5xl p-6 ">
        <div className="border-b dark:border-neutral-700 mb-12 pb-2">
          <h2 className="text-lg font-semibold">Write Blog</h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="mb-4">
          {/* Topic */}
          {/* <div className="mb-4">
            <div className="flex items-center">
              <input
                type="text"
                name="topic"
                value={formik.values.topic}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter topic"
                className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white rounded-md p-2 mb-1 w-full focus:outline-none focus:border-blue-200"
              />
            </div>
            {formik.touched.topic && formik.errors.topic ? (
              <div className="text-red-500 text-sm">{formik.errors.topic}</div>
            ) : null}
          </div> */}

         

          {/* Heading */}
          <div className="mb-4">
            <input
              type="text"
              name="heading"
              value={formik.values.heading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter heading"
              className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white rounded-md p-2 mb-1 w-full focus:outline-none focus:border-blue-200"
            />
            {formik.touched.heading && formik.errors.heading ? (
              <div className="text-red-500 text-sm">
                {formik.errors.heading}
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="mb-4">
            <textarea
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter content"
              className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white rounded-md p-2 mb-1 w-full focus:outline-none focus:border-blue-200"
              rows={6}
            />
            {formik.touched.content && formik.errors.content ? (
              <div className="text-red-500 text-sm">
                {formik.errors.content}
              </div>
            ) : null}
          </div>


           {/* Thumbnail Upload Section */}
           <div className="mb-4">
            {!previewUrl && (
              <div className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 border-dashed dark:text-white rounded-md py-9 w-full">
                <label className="cursor-pointer flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                  <span className="text-gray-500 dark:text-gray-400 flex gap-3">
                    <Image /> Click to upload a thumbnail
                  </span>
                </label>
              </div>
            )}
          </div>

          {previewUrl && (
            <div  className="relative w-[200px] mb-8">
              <img
                src={previewUrl}
                alt="Thumbnail Preview"
                className="w-[200px] rounded-lg"
              />
              <button
                onClick={handleRemoveThumbnail}
                className="absolute top-2 left-2 text-red-400 pt-[-10px]  "
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          )}

          {/* Attachments */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
              Upload Attachment (Choose one: Image or Video)
            </label>

            {/* Radio Button to Choose Attachment Type */}
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="image"
                  checked={attachmentType === "image"}
                  onChange={() => setAttachmentType("image")}
                  className="mr-2"
                />
                <span className=" text-gray-700 dark:text-neutral-300">
                  Image
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="video"
                  checked={attachmentType === "video"}
                  onChange={() => setAttachmentType("video")}
                  className=" mr-2"
                />
                <span className="text-gray-700 dark:text-neutral-300">
                  Video
                </span>
              </label>
            </div>

            {/* File Upload Input and Preview */}
            {!attachmentPreviewUrl && (
              <div className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 dark:text-white rounded-md border-dashed py-9 w-full">
                <label className="cursor-pointer flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept={attachmentType === "image" ? "image /*" : "video/*"}
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                  <span className="text-gray-500 dark:text-gray-400 flex gap-4">
                    {attachmentType === "image" ? <Image /> : <MonitorPlay />}{" "}
                    Click to upload {attachmentType}
                  </span>
                </label>
              </div>
            )}

            {attachmentPreviewUrl && (
              <div className="relative mt-4 ">
                {/* Close icon to deselect file */}
                <button
                  onClick={handleRemoveAttachment}
                  className="absolute  text-red-400 p-1  "
                >
                  <IoCloseCircleOutline size={24} />
                </button>

                {/* Show either image or video preview */}
                {attachmentType === "image" ? (
                  <img
                    src={attachmentPreviewUrl}
                    alt="Attachment Preview"
                    className="w-[200px] rounded-lg"
                  />
                ) : (
                  <div className="dark:bg-neutral-700 max-w-max rounded-lg pr-7">
                    <video
                      src={attachmentPreviewUrl}
                      controls
                      className="w-[200px] rounded-lg ml-7"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4  py-1 items-center">
            <button
              onClick={handleClose}
              className=" mr-4 dark:bg-neutral-700 bg-neutral-200 py-1 px-3 rounded-md "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-thirve-blue hover:bg-blue-400 text-white  py-1 px-4 rounded  ${
                isLoading
                  ? "opacity-50 flex items-center cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  {" "}
                  Posting...
                  <CircularProgress size="20px" color="inherit" />
                </span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;
