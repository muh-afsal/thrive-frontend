/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CLIENT_API } from "@/axios";
import { toast } from "react-toastify";
import cloudinaryUpload from "@/utils/cloudinary/cloudinaryService";
import { FaSpinner } from "react-icons/fa";
import { fetchUser } from "@/redux/actions/user/fetchUserActions";
import { logout } from "@/redux/actions/user/logoutUserActions";
import { useNavigate } from "react-router-dom";

const GeneralInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const { data } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = data?._id;

 

  const defaultAvatarUrl =
    "https://res.cloudinary.com/djo6yu43t/image/upload/v1725124534/IMG_20240831_224439_v7rnsg.jpg";

  const formik = useFormik({
    initialValues: {
      profileImage: data?.profileImage,
      firstname: data?.firstname || "",
      lastname: data?.lastname || "",
      email: data?.email || "",
      phone: data?.phone || "",
      address: data?.address || "",
      profession: data?.profession || "",
      bio: data?.bio || "",
    },
    onSubmit: async (values) => {
      const payload = {
        profileImage: values.profileImage || data?.profileImage || "",
        firstname: values.firstname || data?.firstname || "",
        lastname: values.lastname || data?.lastname || "",
        email: values.email || data?.email || "",
        phone: values.phone || data?.phone || "",
        address: values.address || data?.address || "",
        profession: values.profession || data?.profession || "",
        bio: values.bio || data?.bio || "",
      };


      setLoading(true);

      try {
        await CLIENT_API.post("/user/editProfile", payload, {
          withCredentials: true,
        });
        toast.success("Profile updated successfully!");
        if (userId) {
          dispatch(fetchUser({ userId }));
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred!");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setImageUploading(true);
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      try {
        const cloudinaryUrl = await cloudinaryUpload(file);
        formik.setFieldValue("profileImage", cloudinaryUrl);
        setPreview(cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading image to Cloudinary", error);
        toast.error("Failed to upload image. Please try again.");
        setPreview(null);
        formik.setFieldValue("profileImage", "");
      } finally {
        setImageUploading(false);
        URL.revokeObjectURL(localUrl);
      }
    }
  };

  const removeImage = () => {
    formik.setFieldValue("profileImage", defaultAvatarUrl);
    setPreview(defaultAvatarUrl);
  };

  useEffect(() => {
    if (data?.profileImage) {
      setPreview(data.profileImage);
    }
  }, [data?.profileImage]);

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 45);
    formik.setFieldValue("bio", value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let maxLength = 20;
    if (id === "address" || id === "bio" || id === "profession") {
      maxLength = 45;
    }
    formik.setFieldValue(id, value.slice(0, maxLength));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    formik.setFieldValue("phone", value);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <section className="bg--400 w-full h-full">
      <div className="bg--400 w-full h-[70px] border-b  flex items-center pl-11 pt-4">
        <h1 className="text-2xl font-semibold">General Information</h1>
      </div>
      <div className="w-full h-5/6 flex justify-center bg--400 pt-6 items-center">
        <div className="w-full md:w-[90%] flex bg--300 h-full">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full h-full flex flex-col bg--400"
          >
            <div className="bg--300 w-full flex flex-col justify-center h-[40%] px-5 pl-7 bg-cover bg-center border-b border-slate-100 mb-10">
              <div className="flex">
                <div className="flex flex-row bg--200 w-[20%]">
                  <div className="bg--300 relative w-28 h-28 rounded-full border overflow-hidden mb-2 shadow-sm">
                    {imageUploading ? (
                      <div className="flex justify-center items-center w-full h-full bg-gray-200">
                        <FaSpinner className="animate-spin text-gray-500 text-3xl" />
                      </div>
                    ) : preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="bg--500 flex justify-center items-center pt-[54px] ml-[-50px] z-30">
                    {preview && !imageUploading && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="ml-4 bg-slate-50 rounded-full p-2"
                      >
                        <FaTrash className="text-slate-400 text-lg" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg--400 w-[80%] flex justify-center flex-col pl-2 pt-5">
                  <h1 className="text-2xl font-bold">
                    {data?.firstname} {data?.lastname}
                  </h1>
                  <div className="bg--500 w-[80%] relative">
                    {editingBio ? (
                      <input
                        type="text"
                        id="bio"
                        value={formik.values.bio}
                        onChange={handleBioChange}
                        onBlur={() => setEditingBio(false)}
                        className="p-2 mb-2 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                      />
                    ) : (
                      <div className="relative">
                        <p className="p-2 mb-2 w-full font-semibold text-gray-600">
                          {formik.values.bio || "About"}
                        </p>
                        <button
                          type="button"
                          onClick={() => setEditingBio(true)}
                          className="absolute top-0 right-0 p-2"
                        >
                          <MdEdit className="text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[400px]">
                  <label
                    htmlFor="firstname"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    value={formik.values.firstname}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />

                  <label
                    htmlFor="lastname"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    value={formik.values.lastname}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />

                  <label
                    htmlFor="email"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    disabled
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500 bg-transparent cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[400px]">
                  <label
                    htmlFor="phone"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />

                  <label
                    htmlFor="address"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formik.values.address}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />

                  <label
                    htmlFor="profession"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    value={formik.values.profession}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-1/6 flex bg--400">
              <div className="w-[50%] h-full flex justify-center items-center">
                <button
                  type="submit"
                  className="rounded-md bg-thirve-blue text-white font-semibold p-2 mr-5 disabled:opacity-50"
                  disabled={loading || imageUploading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  className="rounded-md bg-slate-200 font-semibold p-2"
                  onClick={formik.handleReset}
                  disabled={loading || imageUploading}
                >
                  Cancel
                </button>
              </div>
              <div className="w-[50%] h-full flex justify-center items-center">
                <button
                  type="button"
                  className="rounded-md bg-red-600 text-white font-semibold p-2"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GeneralInfo;
