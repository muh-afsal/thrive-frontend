/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { login, googleLoginOrSignUp } from "../../redux/actions/auth";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Header from "../../components/navbars/AuthNavbar";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import { selectUserState } from "../../redux/reducers/user/userSlice";
import ForgetOtpEntry from "@/components/signup/ForgetOtpEntry";
import forgetPasswordImage from '@/assets/images/signup/forgetpasswordimage.png';
import Modal from "@/components/modals/CommonModal";
import { CLIENT_API } from "@/axios";
import { config } from "@/common/configuratoins";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const forgotPasswordValidationSchema = Yup.object({
  verifyemail: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
});

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectUserState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpForm, setIsOtpForm] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(login(values));
        if (login.fulfilled.match(resultAction)) {
          navigate("/home");
        }
      } catch (error: unknown) {
        console.log(error, "Error during login");
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const resultAction = await dispatch(googleLoginOrSignUp(credentialResponse));
      if (googleLoginOrSignUp.fulfilled.match(resultAction)) {
        navigate("/home");
      }
    } catch (error: unknown) {
      console.log("Google login failed", error);
    }
  };

  const handleForgetPassword = () => {
    setIsModalOpen(true);
    setIsOtpForm(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEmailSubmit = async (
    values: { verifyemail: string },
    { setFieldError }: FormikHelpers<{ verifyemail: string }>
  ) => {
    try {
      const payload = {
        email: values.verifyemail,
      };
  
      const response = await CLIENT_API.post("/auth/check-email", payload, config);
  
      if (response.status === 200 && response.data.success) {
        console.log("Email is valid:", response.data.message);
        setIsOtpForm(true); 
        setForgotEmail(values.verifyemail); 
      } else {
        setFieldError(
          "verifyemail",
          "Couldn't find an account with this email. Please provide an email associated with a Thrive account."
        );
      }

       
       await CLIENT_API.post('/auth/resend-otp', payload, config);
      // console.log(sendotpResponse,'responce from teh api call of resend otp -------');


    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setFieldError(
          "verifyemail",
          "Couldn't find an account with this email. Please provide an email associated with a Thrive account."
        );
      } else {
        console.error("Error during forgot password email submission", error);
        setFieldError("verifyemail", "Something went wrong. Please try again later.");
      }
    }
  };
  

  return (
    <>
      <Helmet>
        <title>Login to Thrive</title>
      </Helmet>
      <div className="">
        <Header />
        <section className="w-full h-screen pt-7 px-3 flex justify-center bg-white dark:bg-dark-bg dark:text-dark-text">
          <div className="w-full dark:mt-11 h-[80%] flex justify-center pb-4 items-center flex-col">
           <div className="bg-white dark:bg-neutral-900 flex flex-col items-center p-7 lg:p9 rounded-xl ">
            <div className="flex flex-col bg--400 justify-center items-center text-center p-4 mb-4">
              <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl">
                Welcome to Thrive,
              </h1>
              <h1 className="mb-2 font-extrabold text-2xl lg:text-3xl">
                Sign In to get Started.
              </h1>
              <h4 className="text-gray-400 text-sm">
                Enter your details to proceed further
              </h4>
            </div>
            <div className="flex w-[100%] bg--500 md:w-[400px] flex-col justify-center bg-grey-400 items-center text-center ">
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 w-full">
                <input
                  type="text"
                  placeholder="Email"
                  id="email"
                  className="bg-slate-100 p-2 rounded-lg w-full   dark:bg-neutral-800 dark:border-neutral-600 dark:text-white border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-[-10px] flex justify-start">{formik.errors.email}</div>
                ) : null}
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="bg-slate-100 p-2 rounded-lg border  dark:bg-neutral-800 dark:border-neutral-600 dark:text-white border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm mt-[-10px] flex justify-start">{formik.errors.password}</div>
                ) : null}
                <button
                  type="submit"
                  className="bg-thirve-blue text-white font-semibold p-2 rounded-lg hover:opacity-95 disabled:opacity-80 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Log in"}
                </button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div>
                    <p
                      className="text-blue-500 dark:to-blue-400 hover:cursor-pointer text-sm font-medium"
                      onClick={handleForgetPassword}
                    >
                      Forgot password?
                    </p>
                  </div>
                <p>or</p>
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    size="large"
                    shape="circle"
                    width="300"
                  />
                </div>
              </form>
              <p className="mt-5 text-sm font-semibold text-gray-500 dark:text-white">
                Don't have an account? 
                <Link to="/signup">
                  <span className="text-thirve-blue dark-links"> Sign Up</span>
                </Link>
              </p>
            </div>
            </div>
          </div>
        </section>
        {/* Modal for forgot password */}
        {isModalOpen && (
          <Modal size={"w-[350px]"} onClose={handleCloseModal}>
            {!isOtpForm ? (
              <Formik
                initialValues={{ verifyemail: "" }}
                validationSchema={forgotPasswordValidationSchema}
                onSubmit={handleEmailSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-4">
                    <h1 className="text-2xl dark-links  text-center font-extrabold mb-5">
                      Forgot Password?
                    </h1>
                    <h1 className="text-xs text-slate-600 text-center font-semibold">
                      Enter the email address associated with your account and
                      we'll send you a link to reset your password.
                    </h1>
                    <img
                      src={forgetPasswordImage}
                      alt="Forget password"
                      className="h-[120px] mx-auto mt-7 mb-7"
                    />
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
                      className="bg-thirve-blue w-full text-white  font-semibold p-2 rounded-lg  hover:opacity-80 disabled:opacity-80 mt-5"
                    >
                      {isSubmitting ? "Loading..." : "Submit"}
                    </button>
                    <p className="mt-5 text-sm font-semibold text-gray-500">
                      <span
                        className="text-thirve-blue hover:cursor-pointer"
                        onClick={() => {
                          setIsOtpForm(false);
                          handleCloseModal();
                        }}
                      >
                        Cancel
                      </span>
                    </p>
                  </Form>
                )}
              </Formik>
            ) : (
              <ForgetOtpEntry email={forgotEmail} onOtpVerified={handleCloseModal} />
            )}
          </Modal>
        )}
      </div>
    </>
  );
};

export default Login;
