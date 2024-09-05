/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
import Modal from "../../components/modals/ConfirmationModal";
import forgetPasswordImage from "@/assets/images/signup/forgetpasswordimage.png";

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

const forgotPasswordValidationSchema = Yup.object({
  verifyemail: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
});

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleForgetPassword = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Sign Up to Thrive</title>
      </Helmet>
      <div>
        <Header />
      </div>
      <section className="w-full h-screen pt-7 px-3 flex justify-center ">
        <div className="w-full h-[80%] flex justify-center pt-9 items-center flex-col">
          <div className="flex flex-col justify-center items-center text-center p-4 mb-4">
            <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl ">
              Welcome to Thrive,
            </h1>
            <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl ">
              Sign Up to get Started.
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
                        className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="firstname"
                        component="div"
                        className="text-red-500 text-sm text-left mt-1"
                      />
                    </div>

                    <div className="flex flex-col w-[48%]">
                      <Field
                        type="text"
                        placeholder="Last name"
                        id="lastname"
                        name="lastname"
                        className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="lastname"
                        component="div"
                        className="text-red-500 text-sm text-left mt-1"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Field
                      type="text"
                      placeholder="Email"
                      id="email"
                      name="email"
                      className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm text-left mt-1"
                    />
                  </div>

                  <div className="relative">
                    <Field
                      type="password"
                      placeholder="Create Password"
                      id="password"
                      name="password"
                      className="bg-slate-100 p-2 rounded-lg border  w-full border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="password"
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
                      className="bg-slate-100 p-2 rounded-lg border  w-full border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm text-left mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="bg-thirve-blue text-white font-semibold p-2 rounded-lg  hover:opacity-95 disabled:opacity-80 mt-9"
                  >
                    {isLoading || isSubmitting ? "Loading..." : "Sign Up"}
                  </button>

                  <div>
                    <p
                      className="text-blue-700 hover:cursor-pointer text-sm font-medium"
                      onClick={handleForgetPassword}
                    >
                      Forgot password?
                    </p>
                  </div>

                  <p className="mb-[-10px]">or</p>

                  <div className="flex justify-center w-full">
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
                <span className="text-thirve-blue">Log in</span>
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Modal for forgot password */}
      {isModalOpen && (
        <Modal size={"w-[350px]"} onClose={handleCloseModal}>
          <h1 className="text-2xl text-center font-extrabold mb-5">Forgot Password?</h1>
          <h1 className="text-xs text-slate-600 text-center font-semibold">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </h1>
          <img
            src={forgetPasswordImage}
            alt="Forget password"
            className="h-[120px] mx-auto mt-7 mb-7"
          />
          <Formik
            initialValues={{
              verifyemail: "",
            }}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={async (values) => {
              try {
                // Handle forgot password logic here
                console.log(values);
              } catch (error: unknown) {
                console.log(error, "Error during forgot password");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-4">
                <div className="relative flex flex-col w-full">
                  <Field
                    type="text"
                    placeholder="Enter your email"
                    id="verifyemail"
                    name="verifyemail"
                    className="bg-slate-100 p-2 rounded-lg w-full border border-gray-300 focus:border-blue-300 focus:outline-none  focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="verifyemail"
                    component="div"
                    className="text-red-500 text-sm text-left mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-thirve-blue w-full text-white font-semibold p-2 rounded-lg  hover:opacity-80 disabled:opacity-80 mt-5"
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
                <p className="mt-5 text-sm font-semibold text-center text-gray-500">
                Don't have an account? 
                  <span className="text-thirve-blue" onClick={handleCloseModal}> Sign Up</span>
              </p>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default SignUp;
