import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaTrash } from "react-icons/fa";

const GeneralInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      profilePicture: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      profession: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone Number is required"),
      address: Yup.string().required("Address is required"),
      profession: Yup.string().required("Profession is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Data Submitted:", values);
      const formData = new FormData();
      formData.append("profilePicture", values.profilePicture);
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("profession", values.profession);
      // Send formData to backend
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    formik.setFieldValue("profilePicture", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    formik.setFieldValue("profilePicture", "");
    setPreview(null);
  };

  return (
    <section className="bg--400 w-full h-full">
      <div className="bg--400 w-full h-[70px] flex items-center pl-11 pt-4">
        <h1 className="text-2xl font-semibold">General Information</h1>
      </div>
      <div className="w-full h-4/6 flex justify-center items-center">
        <div className="w-full md:w-[90%] flex  bg--300 h-full">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full h-full flex flex-col  bg--400"
          >
            <div className="w-full h-[30%] bg--300 px-5 pl-7 bg-cover bg-center border-b border-slate-100 mb-10">
              <div className=" flex flex-row">
                <div className="relative w-32 h-32 rounded-full border overflow-hidden mb-2">
                  {preview ? (
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
                    id="profilePicture"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className=" bg--500 flex justify-center items-center pt-[54px] ml-[-50px] z-30">
                  {preview && (
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
              <label className="block text-gray-500 text-xs font-medium mb-1 ">
                  Click to Add or change photo
                </label>
            </div>

            <div className="flex ">
              <div className="w-[50%] h-full  flex justify-center items-center">
                <div className="w-[400px] ">
                  <label
                    htmlFor="fullName"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                  {formik.touched.fullName && formik.errors.fullName ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.fullName}
                    </div>
                  ) : null}
                  <label
                    htmlFor="fullName"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                  {formik.touched.fullName && formik.errors.fullName ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.fullName}
                    </div>
                  ) : null}

                  <label
                    htmlFor="email"
                    className="block text-gray-500 text-xs font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.email}
                    </div>
                  ) : null}
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.phone}
                    </div>
                  ) : null}
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.address}
                    </div>
                  ) : null}

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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-2 mb-10 w-full font-semibold border-b border-gray-200 text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  />
                  {formik.touched.profession && formik.errors.profession ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.profession}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full h-1/6 flex">
        <div className="w-[50%] h-full flex justify-center items-center">
          <button
            type="submit"
            className="rounded-md bg-thirve-blue text-white font-semibold p-2 mr-5"
            onClick={() => formik.handleSubmit}
          >
            Update Settings
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-200 font-semibold p-2"
            onClick={formik.handleReset}
          >
            Cancel
          </button>
        </div>
        <div className="w-[50%] h-full flex justify-center items-center">
          <button
            type="button"
            className="rounded-md bg-red-100 font-semibold p-2 px-4 mr-5"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default GeneralInfo;
