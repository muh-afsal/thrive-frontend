import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { signup } from "../../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import Header from "../../components/navbars/AuthNavbar";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().required("Phone number is required").matches(/^\d{10}$/, "Phone number must be 10 digits"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Helmet>
        <title>Sign Up to Thrive</title>
      </Helmet>
      <div className="">
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
            <div className="flex w-[90%] md:w-[400px] flex-col justify-center bg-grey-400 items-center text-center ">
              <div className="mt-[-10px] mb-5">
                {error && typeof error === "string" && (
                  <p className="text-red-500">{error}</p>
                )}
              </div>

              <Formik
                initialValues={{
                  email: "",
                  username: "",
                  password: "",
                  phone: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  try {
                    const resultAction = await dispatch(signup(values));
                    if (signup.fulfilled.match(resultAction)) {
                      navigate("/otp-entry", { state: { formData: values } });
                    }
                  } catch (error: unknown) {
                    console.log(error, "consoolllinnngnnggggggg=======>");
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col gap-4 w-full">
                    <div className="relative">
                      <Field
                        type="text"
                        placeholder="Username"
                        id="username"
                        name="username"
                        className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none  focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 text-sm text-left mt-1"
                      />
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
                        type="password"
                        placeholder="Password"
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
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="bg-thirve-blue text-white font-semibold p-2 rounded-lg  hover:opacity-95 disabled:opacity-80 mt-9"
                    >
                      {isLoading || isSubmitting ? "Loading..." : "Sign Up"}
                    </button>
                    <p className="text-blue-700 text-sm font-medium">
                      Forgot password?
                    </p>
                    <p className="mb-[-10px]">or</p>
                    <div className="flex justify-center w-full">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          console.log(credentialResponse);
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
            <div></div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignUp;
