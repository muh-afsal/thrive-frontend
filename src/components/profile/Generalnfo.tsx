/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CLIENT_API } from "@/axios";
import { toast } from "react-toastify";
import cloudinaryimageUpload from "@/utils/cloudinary/cloudinaryService";
import { FaSpinner } from "react-icons/fa";
import { fetchUser } from "@/redux/actions/user/fetchUserActions";
import { logout } from "@/redux/actions/auth/logoutUserActions";
import { useNavigate } from "react-router-dom";
import { config } from "@/common/configuratoins";
import Modal from "../modals/CommonModal";
import ChangeEmailImage from "@/assets/images/profile/changeemailImage.png";
import ChangeEmailOtpEntry from "./ChangeEmailOtpEntry";

const GeneralInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const { data } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [verifyEmail, setVerifyEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isOtpForm, setIsOtpForm] = useState(false);
  const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userId = data?._id;
  // console.log(newEmail,
  //   'this is the new email to 000000000000000000000000000000000000000000000'
  // );

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
        await CLIENT_API.post("/auth/user/editProfile", payload, {
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
        const cloudinaryUrl = await cloudinaryimageUpload(file);
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

  const handleChangeEmail = () => {
    setIsModalOpen(true);
    setIsOtpForm(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmailSubmit = async () => {
    if (!emailValidationRegex.test(verifyEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
  
    setEmailError("");
  
    try {
      const payload = { email: verifyEmail };
      console.log(payload, "this is payload--------------");
  
      const response = await CLIENT_API.post(
        "/auth/check-email",
        payload,
        config
      );
  
      // Check if the email is already associated with an account
      if (response.status === 200 && response.data.success) {
        // User exists with this email, show an error
        setEmailError("An account already exists with this email. Please try another.");
      } else {
        // If the response indicates no user is associated with this email
        console.log("Email is valid:", response);
        setIsOtpForm(true);
        setNewEmail(verifyEmail);
        await CLIENT_API.post("/auth/resend-otp", payload, config);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setEmailError(
          "Couldn't find an account with this email. Please provide an email associated with a Thrive account."
        );
      } else {
        console.error("Error during forgot password email submission", error);
        setEmailError("Something went wrong. Please try again later.");
      }
    }
  };
  

  return (
    <section className="bg--400 w-full h-full">
      <div className="bg--400 w-full h-[70px] border-b dark:border-neutral-700 flex items-center pl-11 pt-4">
        <h1 className="text-2xl font-semibold">General Information</h1>
      </div>
      <div className="w-full h-5/6 flex justify-center bg--400 pt-6 items-center">
        <div className="w-full md:w-[90%] flex bg--300 h-full">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full h-full flex flex-col bg--400"
          >
            <div className="bg--300 w-full flex flex-col justify-center h-[40%] px-5 pl-7 bg-cover bg-center border-b dark:border-neutral-700 border-slate-100 mb-10">
              <div className="flex">
                <div className="flex flex-row bg--200 w-[20%]">
                  <div className="bg--300 relative w-28 h-28 rounded-full border dark:border-neutral-700 overflow-hidden mb-2 shadow-sm">
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
                      autoComplete="off"
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
                        autoComplete="off"
                        value={formik.values.bio}
                        onChange={handleBioChange}
                        onBlur={() => setEditingBio(false)}
                        className="p-2 mb-2 w-full font-semibold border-b dark:border-neutral-700 dark:bg-neutral-900 dark:text-white border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                      />
                    ) : (
                      <div className="relative">
                        <p className="p-2 mb-2 w-full font-semibold text-gray-600 dark:text-neutral-500">
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
                    autoComplete="off"
                    id="firstname"
                    value={formik.values.firstname}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />

                  <label
                    htmlFor="lastname"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    id="lastname"
                    value={formik.values.lastname}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 dark:bg-neutral-900 dark:text-white text-gray-600 dark:border-neutral-700 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />

                  <label
                    htmlFor="email"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative w-full mb-10">
                    <input
                      type="email"
                      id="email"
                      autoComplete="off"
                      value={formik.values.email}
                      disabled
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="p-2 w-full font-semibold border-b border-gray-200 dark:bg-neutral-900 dark:text-white text-gray-600 dark:border-neutral-700 focus:border-blue-200 focus:outline-none focus:ring-blue-500 bg-transparent"
                    />
                    <span
                      className="absolute right-0 top-2 text-blue-500 text-sm cursor-pointer hover:underline"
                      onClick={handleChangeEmail}
                    >
                      Change Email
                    </span>
                  </div>
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
                    autoComplete="off"
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 dark:bg-neutral-900 dark:text-white text-gray-600 dark:border-neutral-700 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
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
                    autoComplete="off"
                    value={formik.values.address}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 dark:bg-neutral-900 dark:text-white text-gray-600 dark:border-neutral-700 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
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
                    autoComplete="off"
                    value={formik.values.profession}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 dark:bg-neutral-900 dark:text-white text-gray-600 dark:border-neutral-700 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {isModalOpen && (
              <Modal size={"w-[350px]"} onClose={handleCloseModal}>
                {!isOtpForm ? (
                  <div className="mt-4">
                    <h1 className="text-2xl dark-links text-black dark:text-white text-center font-extrabold mb-5">
                      Enter New Email
                    </h1>
                    <h1 className="text-xs text-neutral-600 dark:text-neutral-500 text-center font-semibold">
                      Enter the new email address and
                      we'll send you an OTP to verify your email.
                    </h1>
                    <img
                      src={ChangeEmailImage}
                      alt="Change Email"
                      className="h-[120px] mx-auto mt-7 mb-7"
                    />
                    <div className="relative flex flex-col w-full">
                      <input
                        type="text"
                        placeholder="Enter your email"
                        id="verifyemail"
                        name="verifyemail"
                        value={verifyEmail}
                        onChange={(e) => setVerifyEmail(e.target.value)} // Set email from input
                        className="bg-slate-100 dark:bg-neutral-800 dark:border-neutral-600 p-2 rounded-lg w-full border border-gray-300 focus:border-blue-300 focus:outline-none focus:ring-blue-500"
                      />
                      {emailError && (
                        <div className="text-red-500 text-sm text-left mt-1">
                          {emailError}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleEmailSubmit} // Handle email submission directly
                      className="bg-thirve-blue w-full text-white font-semibold p-2 rounded-lg hover:opacity-80 mt-5"
                    >
                      Submit
                    </button>
                    <p className="mt-2 text-sm font-semibold text-gray-500 w-full flex items-center justify-center">
                      <span
                        className="text-black w-full bg-neutral-300 dark:bg-neutral-700 dark:text-white p-2 rounded-lg hover:cursor-pointer flex items-center justify-center"
                        onClick={() => {
                          setIsOtpForm(false);
                          handleCloseModal();
                        }}
                      >
                        Cancel
                      </span>
                    </p>
                  </div>
                ) : (
                  <ChangeEmailOtpEntry
                    email={newEmail}
                    onOtpVerified={handleCloseModal}
                    
                  />
                )}
              </Modal>
            )}
            <div className="w-full h-1/6 flex bg--400">
              <div className="w-[50%] h-full flex justify-center items-center">
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 text-white font-semibold px-2 p-1 mr-5 disabled:opacity-50"
                  disabled={loading || imageUploading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  className="rounded-md bg-neutral-200 dark:bg-neutral-600 font-semibold px-2 p-1"
                  onClick={formik.handleReset}
                  disabled={loading || imageUploading}
                >
                  Cancel
                </button>
              </div>
              <div className="w-[50%] h-full flex justify-center items-center">
                <button
                  type="button"
                  className="rounded-md bg-red-800 text-white font-semibold px-2 p-1"
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
