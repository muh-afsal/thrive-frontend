// import React, { useState, useEffect } from "react";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  blogData: {
    _id: string;
    heading: string;
    content: string;
    thumbnail: string | null;
    attachmentType: "image" | "video";
    attachment: string | null;
  };
}

const validationSchema = Yup.object({
  heading: Yup.string().trim().required("Heading is required"),
  content: Yup.string().trim().required("Content is required"),
});

const EditBlogModal: React.FC<EditBlogModalProps> = ({
  isOpen,
  onClose,
  blogData,
  setRefresh,
}) => {
  console.log(blogData,'hhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<"image" | "video">(
    blogData.attachmentType
  );
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
      heading: blogData.heading,
      content: blogData.content,
    },
    validationSchema,
    enableReinitialize: true,
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

        const updatedBlogData = {
          ...values,
          blogId:blogData._id,
          thumbnail: uploadedUrlThumbnail || blogData.thumbnail,
          attachmentType,
          author: currentUserId,
          attachment: uploadedUrlAttachment || blogData.attachment,
        };
       console.log(updatedBlogData,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
       
        try {
          const response = await CLIENT_API.post(
            `/media/add-blog`,
            updatedBlogData
          );
          console.log(
            response,
            "response from edit blog API***********************"
          );
        } catch (error) {
          console.error("Error updating blog via API:", error);
          throw new Error("Blog API request failed");
        }
      } catch (error) {
        console.error("Error during blog update process:", error);
      } finally {
        setIsLoading(false);
        handleClose();
        setRefresh((prev) => !prev)
      }
    },
  });

  useEffect(() => {
    if (blogData.thumbnail) {
      setPreviewUrl(blogData.thumbnail);
    }
    if (blogData.attachment) {
      setAttachmentPreviewUrl(blogData.attachment);
    }
  }, [blogData]);

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
          <h2 className="text-lg font-semibold">Edit Blog</h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="mb-4">
        

         
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
  <CKEditor
    editor={ClassicEditor}
    data={formik.values.content}
    onChange={(event, editor) => {
      const data = editor.getData();
      formik.setFieldValue("content", data);
    }}
    onBlur={() => formik.setFieldTouched("content", true)}
    config={{
      placeholder: "Enter content",
      toolbar: [
        'undo', 'redo', '|',
        'bold', 'italic', '|',
        'paragraph', 'heading', '|',
        'heading1', 'heading2', 'heading3', '|',
        'link'
      ]
      
    }}
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
            <div className="relative w-[200px] mb-8">
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


          {/* Attachment Upload Section */}
          <div className="mb-4">
            <select
              value={attachmentType}
              onChange={(e) =>
                setAttachmentType(e.target.value as "image" | "video")
              }
              className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white rounded-md p-2 mb-1 w-full"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>

            {!attachmentPreviewUrl && (
              <div className="border bg-slate-100 border-gray-300 dark:bg-neutral-700 dark:border-neutral-500 border-dashed dark:text-white rounded-md py-9 w-full">
                <label className="cursor-pointer flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept={attachmentType === "image" ? "image/*" : "video/*"}
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                  <span className="text-gray-500 dark:text-gray-400 flex gap-3">
                    <MonitorPlay /> Click to upload {attachmentType}
                  </span>
                </label>
              </div>
            )}
          </div>

          {attachmentPreviewUrl && (
            <div className="relative w-[200px] mb-8">
              {attachmentType === "image" ? (
                <img
                  src={attachmentPreviewUrl}
                  alt="Attachment Preview"
                  className="w-[200px] rounded-lg"
                />
              ) : (
                <video
                  src={attachmentPreviewUrl}
                  controls
                  className="w-[200px] rounded-lg"
                />
              )}
              <button
                onClick={handleRemoveAttachment}
                className="absolute top-2 left-2 text-red-400 pt-[-10px]  "
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          )}
           <div className="flex  justify-end mt-4  py-1 items-center">
          <button
            onClick={handleClose}
            className=" mr-4 dark:bg-neutral-700 bg-neutral-200 py-1 px-3 rounded-md "
          >
            Cancel
          </button>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-[100px] px-2 py-1 text-white rounded-md ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update"
            )}
          </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 hover:text-red-500 transition"
        >
          <IoCloseCircleOutline size={24} />
        </button>
      </div>
    </div>
  );
};

export default EditBlogModal;
