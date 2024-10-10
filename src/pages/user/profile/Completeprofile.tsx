import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCamera } from "react-icons/fa";
import { completeProfile } from "@/redux/actions/user/completeProfileActions";
import   cloudinaryimageUpload  from '../../../utils/cloudinary/cloudinaryService'; 

const validationSchema = Yup.object({
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  address: Yup.string().trim().required("Address is required"),
  profession: Yup.string().trim().required("Profession is required"),
  bio: Yup.string()
  .trim()
  .test(
    "max-words",
    "Bio must be 20 words or fewer",
    (value) => !value || value.split(/\s+/).length <= 20
  ),
});

const defaultAvatarUrl = "https://res.cloudinary.com/djo6yu43t/image/upload/v1725124534/IMG_20240831_224439_v7rnsg.jpg"; 

const CompleteProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.user);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const localUrl = URL.createObjectURL(file);
      setProfileImage(localUrl);

      try {
        const cloudinaryUrl = await cloudinaryimageUpload(file);
        setProfileImage(cloudinaryUrl); 
      } catch (error) {
        console.error('Error uploading image to Cloudinary', error);
      } finally {
        URL.revokeObjectURL(localUrl);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Complete Your Profile - Thrive</title>
      </Helmet>
      <div className="">
        <section className="w-full h-screen pt-7 px-3 flex justify-center bg--100">
          <div className="w-full h-[80%] flex justify-center pt-9 items-center flex-col">
            <div className="h-[100%] bg-white rounded-lg flex justify-center pt-9 items-center flex-col">
              <div className="flex flex-col justify-center items-center text-center p-4 mb-4">
                <h1 className="mb-5 w-[100%] sm:w-[70%] font-extrabold text-2xl lg:text-3xl">
                  Complete Your Profile to Get Started
                </h1>
                <h4 className="text-gray-400 text-sm">
                  Enter your details to proceed further
                </h4>
              </div>
              <div className="flex w-[90%] md:w-[400px] flex-col justify-center bg-grey-400 items-center text-center">
                <div className="mt-[-10px] mb-5">
                  {error && typeof error === "string" && (
                    <p className="text-red-500">{error}</p>
                  )}
                </div>

                <Formik
                  initialValues={{
                    phone: "",
                    address: "",
                    profession: "",
                    bio: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    try {
                      const finalProfileImage = profileImage || defaultAvatarUrl;

                      const resultAction = await dispatch(
                        completeProfile({
                          ...values,
                          profileImage: finalProfileImage, 
                        })
                      );

                      if (completeProfile.fulfilled.match(resultAction)) {
                        navigate("/home", { state: { formData: values } });
                      }
                    } catch (error) {
                      console.error("Error during profile completion", error);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-4 w-full">
                      <div
                        className={`relative flex justify-center items-center p-2 rounded-lg w-full border border-gray-200 cursor-pointer ${
                          profileImage ? "bg-transparent" : "bg-slate-100"
                        }`}
                        onClick={() =>
                          document.getElementById("profileImageInput")?.click()
                        }
                      >
                        <input
                          type="file"
                          id="profileImageInput"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {!profileImage && (
                          <div className="flex items-center w-full pl-5">
                            <div className="bg-gray-300 p-2 rounded-full mr-4">
                              <FaCamera className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="w-[100%] ml-[-50px]">
                              <span className="text-gray-500">
                                Upload Profile Photo
                              </span>
                            </div>
                          </div>
                        )}
                        {profileImage && (
                          <img
                            src={profileImage}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        )}
                      </div>

                      <div className="relative">
                        <Field
                          type="text"
                          placeholder="Phone number"
                          id="phone"
                          name="phone"
                          className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm text-left mt-1"
                        />
                      </div>

                      <div className="relative">
                        <Field
                          type="text"
                          placeholder="Address"
                          id="address"
                          name="address"
                          className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500 text-sm text-left mt-1"
                        />
                      </div>

                      <div className="relative">
                        <Field
                          type="text"
                          placeholder="Profession"
                          id="profession"
                          name="profession"
                          className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="profession"
                          component="div"
                          className="text-red-500 text-sm text-left mt-1"
                        />
                      </div>

                      <div className="relative">
                        <Field
                          as="textarea"
                          placeholder="Bio (Optional)"
                          id="bio"
                          name="bio"
                          className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500 resize-none h-24"
                        />
                        <ErrorMessage
                          name="bio"
                          component="div"
                          className="text-red-500 text-sm text-left mt-1"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="bg-thirve-blue text-white font-semibold p-2 rounded-lg hover:opacity-95 disabled:opacity-80 mt-9"
                      >
                        {isLoading || isSubmitting
                          ? "Loading..."
                          : "Submit and continue"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CompleteProfile;
