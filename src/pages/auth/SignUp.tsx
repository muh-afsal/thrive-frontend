/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { googleLoginOrSignUp, signup } from "../../redux/actions/auth";
import { useNavigate } from "react-router-dom";
import Header from "../../components/navbars/AuthNavbar";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});



const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.user);

  const loginWithGoogle = async (data: any) => {
    try {
      const resultAction = await dispatch(googleLoginOrSignUp(data));
      if (googleLoginOrSignUp.fulfilled.match(resultAction)) {
        navigate("/home");
      } else {
        console.log("Google login/signup failed");
      }
    } catch (error: unknown) {
      console.error("Error during Google login/signup", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up to Thrive</title>
      </Helmet>
      <div>
        <Header />
      </div>
      <section className="w-full dark:bg-dark-bg  h-screen pt-7 px-3 flex justify-center ">
        <div className="w-full h-[80%] dark:bg-neutral-900 md:w-[500px] rounded-xl pb-10 mt-9 flex justify-center pt-9 items-center flex-col">
          <div className="flex flex-col justify-center  items-center text-center p-4 mb-4">
            <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl dark:text-dark-text ">
              Welcome to Thrive,
            </h1>
            <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl dark:text-dark-text">
              Sign Up to get Started.
            </h1>
            <h4 className="text-gray-400 text-sm dark:text-neutral-300">
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
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const resultAction = await dispatch(signup(values));
                  if (signup.fulfilled.match(resultAction)) {
                    navigate("/otp-entry", { state: { formData: values } });
                  }
                } catch (error: unknown) {
                  console.log(error, "Error during signup");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-4 w-full">
                  <div className="relative flex justify-between">
                    <div className="flex flex-col w-[48%]">
                      <Field
                        type="text"
                        placeholder="First name"
                        id="firstname"
                        name="firstname"
                        className="bg-slate-100 p-2 rounded-lg w-full dark:bg-neutral-800 dark:border-neutral-600 dark:text-white border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="firstname"
                        component="div"
                        className="text-red-500 dark:text-red-400 text-sm text-left mt-1"
                      />
                    </div>

                    <div className="flex flex-col w-[48%]">
                      <Field
                        type="text"
                        placeholder="Last name"
                        id="lastname"
                        name="lastname"
                        className="bg-slate-100 p-2 rounded-lg w-full dark:bg-neutral-800 dark:border-neutral-600 dark:text-white border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="lastname"
                        component="div"
                        className="text-red-500 dark:text-red-400 text-sm text-left mt-1"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Field
                      type="text"
                      placeholder="Email"
                      id="email"
                      name="email"
                      className="bg-slate-100 p-2 rounded-lg w-full dark:bg-neutral-800 dark:border-neutral-600 dark:text-white border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm text-left mt-1"
                    />
                  </div>

                  <div className="relative">
                    <Field
                      type="password"
                      placeholder="Create Password"
                      id="password"
                      name="password"
                      className="bg-slate-100 p-2 rounded-lg border dark:bg-neutral-800 dark:border-neutral-600 dark:text-white w-full border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm text-left mt-1"
                    />
                  </div>

                  <div className="relative">
                    <Field
                      type="password"
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="bg-slate-100 dark:bg-neutral-800 dark:border-neutral-600 p-2 rounded-lg border dark:text-white  w-full border-gray-200    focus:outline-none  focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm text-left mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="bg-thirve-blue text-white font-semibold p-2 rounded-lg  hover:opacity-95 disabled:opacity-80 mt-9"
                  >
                    {isLoading || isSubmitting ? "Loading..." : "Sign Up"}
                  </button>

                 

                  <p className="mb-[-10px]">or</p>

                  <div className="flex justify-center w-full ">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        loginWithGoogle(credentialResponse);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                      size="large"
                      shape="circle"
                      width="300"
                    />
                  </div>
                </Form>
              )}
            </Formik>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Already have an account ?
              <Link to="/login">
                <span className="text-thirve-blue ml-2 dark:text-blue-400">Log in</span>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
