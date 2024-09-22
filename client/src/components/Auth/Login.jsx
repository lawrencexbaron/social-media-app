import React, { useState, useEffect } from "react";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import Label from "../common/Label";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { useAuthStore } from "../../stores/authStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Img from "./../../assets/image/one-one.png";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@account.com");
  const [password, setPassword] = useState("password");

  const { error, login, success, setSuccess, clearError, setAuth } =
    useStore(useAuthStore);

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setTimeout(() => {
        // get token from localstorage
        const token = localStorage.getItem("token");
        // if token is not empty
        if (token) {
          // navigate to feed page
          navigate("/feed");
          // setAuth to true
          setAuth(true);
        }
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      <div className='w-full min-h-screen flex'>
        <div className='hidden sm:flex space-y-10 sm:w-1/2 bg-gray-100 flex-col items-center justify-center'>
          <div className='flex flex-col gap-4'>
            <h1 className='text-4xl font-bold'>Good to See You Again!</h1>
            <p>Dive Back Into Your Social Sphere</p>
          </div>
          <img src={Img} alt='login' className='w-3/4' />
        </div>
        <div className='w-full border sm:px-0 sm:w-1/2 bg-white flex mx-auto sm:items-center sm:justify-center'>
          <form
            className='sm:mt-4 justify-center shadow-sm border sm:max-w-md px-8 py-7 w-full'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col mx-auto py-40 sm:py-0'>
              <h1 className='text-2xl font-bold'>Login</h1>
              <p className='text-gray-600 text-sm'>
                Login to your account to continue
              </p>

              {error && (
                <div
                  className='flex flex-col text-red-700 relative mt-2'
                  role='alert'
                >
                  {Array.isArray(error.message) ? (
                    <ul>
                      {error.message.map((msg, index) => (
                        <li key={index}>{msg}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{error.message}</p>
                  )}
                </div>
              )}
              <div className='mt-5'>
                <Label htmlFor='email'>Email</Label>
                <TextInput
                  id='email'
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='mb-2'
                />

                <Label htmlFor='password'>Password</Label>
                <TextInput
                  id='password'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='mb-2'
                />
              </div>
              <Button
                type='submit'
                className={`bg-slate-800 hover:bg-slate-700 py-2 font-semibold text-sm text-white w-full my-2`}
              >
                {success ? (
                  <AiOutlineLoading3Quarters className='animate-spin mx-auto text-xl' />
                ) : (
                  "Login"
                )}
              </Button>
              <div className='flex  items-center justify-between space-x-2'>
                <Link
                  className='inline-block align-baseline font-semibold text-sm text-slate-800 hover:text-slate-600'
                  to='/register'
                >
                  Register now
                </Link>
              </div>
              <div className='flex items-center justify-end mt-2'></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
