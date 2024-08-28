
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  AppDispatch } from "../../store";
import { login } from "../../redux/actions/authAction";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Header from "../../components/navbars/AuthNavbar";
import * as Yup from "yup";
import { useFormik } from "formik";
import { selectAuthState } from "../../redux/reducers/authSlice";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectAuthState);

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

  return (
    <>
      <Helmet>
        <title>Login to Thrive</title>
      </Helmet>
      <div className="">
        <div>
          <Header />
        </div>
        <section className="w-full h-screen pt-7 px-3 flex justify-center ">
          <div className="w-full h-[80%] flex justify-center pb-4 items-center flex-col">
            <div className="flex flex-col justify-center items-center text-center p-4 mb-4">
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
            <div className="flex w-[80%] md:w-[400px] flex-col justify-center bg-grey-400 items-center text-center ">
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 w-full">
                <input
                  type="text"
                  placeholder="Email"
                  id="email"
                  className="bg-slate-100 p-2 rounded-lg w-full border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm">{formik.errors.email}</div>
                ) : null}
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="bg-slate-100 p-2 rounded-lg border border-gray-200 focus:border-blue-200 focus:outline-none focus:ring-blue-500"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm">{formik.errors.password}</div>
                ) : null}
                <button
                  type="submit"
                  className="bg-thirve-blue text-white font-semibold p-2 rounded-lg hover:opacity-95 disabled:opacity-80 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Log in"}
                </button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <p className="text-blue-700 text-sm font-medium">Forgot password?</p>
                <p>or</p>
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      console.log(credentialResponse);
                      // loginWithGoogle(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                      // toast.error("Something is wrong! Please try later");
                    }}
                    size="large"
                    shape="circle"
                    width="300"
                  />
                </div>
              </form>
              <p className="mt-5 text-sm font-semibold text-gray-500">
                Don't have an account? 
                <Link to="/signup">
                  <span className="text-thrive-blue"> Sign Up</span>
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

export default Login;
