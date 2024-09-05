/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CLIENT_API } from '@/axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUser } from '@/redux/actions/user/fetchUserActions';

const Generalnfo: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const userId = data?._id;

  const initialValues = {
    createPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    createPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Create Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('createPassword')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onSubmit = async (values: { createPassword: string }) => {
    const formData = {
      password: values.createPassword,
    };
    setLoading(true);

      try {
        await CLIENT_API.post("/user/editProfile", formData, {
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
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, resetForm }) => (
        <Form className='bg--400 w-full h-full'>
          <div className='bg--400 w-full h-[80%]'>
            <div className="bg--400 w-full h-[70px] flex items-center pl-11 pt-4">
              <h1 className="text-2xl font-semibold ">Password and Security</h1>
            </div>
            <div className='bg--300 flex flex-col lg:flex-row pt-20 p-6 justify-around'>
              <div className='flex flex-col h-full w-full lg:w-[45%] justify-between'>
                <label
                  htmlFor="createPassword"
                  className="block text-gray-500 text-xs font-medium mb-1"
                >
                  Create Password
                </label>
                <div className='relative'>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    id="createPassword"
                    name="createPassword"
                    className={`p-2 mb-10 w-full font-semibold border-b ${errors.createPassword && touched.createPassword ? 'border-red-500' : 'border-gray-200'} text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500`}
                  />
                  <div
                    className='absolute inset-y-0 right-0 flex items-center pr-3 mt-[-45px] cursor-pointer'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </div>
                </div>
                <ErrorMessage
                  name="createPassword"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
              <div className='flex flex-col h-full w-full lg:w-[45%]'>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-500 text-xs font-medium mb-1"
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <Field
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`p-2 mb-10 w-full font-semibold border-b ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'} text-gray-600 focus:border-blue-200 focus:outline-none focus:ring-blue-500`}
                  />
                  <div
                    className='absolute inset-y-0 right-0 flex items-center pr-3 mt-[-45px] cursor-pointer'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </div>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>
            </div>
          </div>
          <div className='bg--500 h-[20%] w-auto sm:float-right sm:mr-16'>
            <div className="w- h-full flex sm:justify-center items-center flex-col sm:flex-row p-9">
              <button
                type="submit"
                className="rounded-md bg-thirve-blue sm:w-72 text-white w-full font-semibold p-2 mb-4 sm:mb-0 sm:mr-5 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-200 w-full font-semibold p-2"
                disabled={loading}

                onClick={() => resetForm()}
              >
                Cancel
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Generalnfo;
