import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet";
import Header from "../../components/navbars/AuthNavbar";
import changePasswordImage from '@/assets/images/signup/changepasswordimage.png';
import { CLIENT_API } from "@/axios";
import { useNavigate, useLocation } from "react-router-dom";

// Validation schema for the change password form
const validationSchema = Yup.object({
  newPassword: Yup.string()
    .trim()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location?.state as { email: string };

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    const formData = {
      email: email, 
      password: values.newPassword,
    };

    try {
       await CLIENT_API.post("/user/change-password", formData, {
        withCredentials: true,
      });
      navigate("/login"); 
    } catch (error: unknown) {
      console.error("Error during password change", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password</title>
      </Helmet>
      <div>
        <Header />
      </div>
      <section className="w-full h-screen pt-7 px-3 flex justify-center">
        <div className="w-full h-[80%] flex justify-center pt-9 items-center flex-col">
          <div className="flex flex-col justify-center items-center text-center p-4 mb-4">
            <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl">Change Password</h1>
            <h4 className="text-gray-400 text-sm">Enter your new password below</h4>
          </div>
          <div className="flex w-[90%] md:w-[400px] flex-col justify-center bg-grey-400 items-center text-center">
            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-4 w-full">
                  <img
                    src={changePasswordImage}
                    alt="Change Password"
                    className="h-[200px] mx-auto mb-7"
                  />

                  <div className="relative">
                    <Field
                      type="password"
                      placeholder="New Password"
                      id="newPassword"
                      name="newPassword"
                      className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-sm text-left mt-1"
                    />
                  </div>

                  <div className="relative">
                    <Field
                      type="password"
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm text-left mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-thirve-blue text-white font-semibold p-2 rounded-lg hover:opacity-95 disabled:opacity-80 mt-9"
                  >
                    {isSubmitting ? "Loading..." : "Change Password"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
