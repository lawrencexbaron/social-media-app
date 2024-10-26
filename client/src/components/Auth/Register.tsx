import React, { useState } from "react";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import Label from "../common/Label";
import { Link, Navigate } from "react-router-dom";
import { Toast } from "../common/Alert";
import AvatarUpload from "../common/AvatarUpload";
import { register } from "../../utils/api";
import Img from "./../../assets/image/two-two.png";

function Register() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string[] | string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);
  
  const clearForm = () => {
    setEmail("");
    setFirstName("");
    setProfilePicture(null);
    setLastName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (password !== confirmPassword) {
        setError("Passwords do not match");
      }

      const res = await register({
        email,
        firstname: firstName,
        lastname: lastName,
        username: userName,
        password,
        profilePicture,
        confirmPassword,
      });

      if (!res) {
        setError("An unexpected error occurred");
        return;
      }
      setSuccess(true);
      setError(null);
      clearForm();

      // Redirect to login page using Toast countdown
      Toast({
        text: "You are successfully registered! Redirecting...",
        icon: "success",
        timer: 3000,
        position: "top-end",
      });

      setTimeout(() => {
        setShouldRedirect(true);
      }, 3200);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvatarUpload = (data: any) => {
    setProfilePicture(data);
  };

  if (shouldRedirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="w-full min-h-screen flex">
        <div className="hidden sm:flex space-y-10 sm:w-1/2 bg-gray-100 flex-col items-center justify-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold">
              New Here? Join Our Vibrant Community!
            </h1>
            <p>Create Your Account, Open New Worlds</p>
          </div>
          <img src={Img} alt="login" className="w-2/3" />
        </div>
        <div className="w-full sm:px-0 border sm:w-1/2 bg-white flex mx-auto sm:items-center sm:justify-center">
          <form
            className="sm:mt-4 justify-center sm:max-w-md px-8 py-7 border bg-white w-full"
            onSubmit={(e) => handleSubmit(e)}
          >
            <h1 className="text-2xl font-bold">Register</h1>
            {error && (
              <div
                className="bg-red-100 border shadow-sm flex flex-col border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
              >
                <p className="font-bold">Error!</p>

                {Array.isArray(error) ? (
                  error.map((err) => <p key={err}>{err}</p>)
                ) : (
                  <p>{error}</p>
                )}
              </div>
            )}
            {success && (
              <div
                className="bg-green-100 border flex flex-col border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                role="alert"
              >
                <p className="font-bold">Success!</p>
                <p>You are successfully registered!</p>
              </div>
            )}

            <div className="mb-4">
              <div className="my-4">
                <AvatarUpload onUpload={handleAvatarUpload} />
              </div>

              <div className="flex gap-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <TextInput
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <TextInput
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mb-2"
                  />
                </div>
              </div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2"
              />

              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="mb-2"
              />

              <Label htmlFor="password">Confirm Password</Label>
              <TextInput
                id="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="mb-2"
              />
            </div>
            <div className="flex flex-col items-end justify-between space-y-2">
              <Link
                className="inline-block align-baseline font-semibold text-sm text-slate-800 hover:text-slate-600"
                to="/"
              >
                Already have an account? Login
              </Link>
              <Button
                type="submit"
                className={`bg-slate-800 hover:bg-slate-700 py-2 font-semibold text-sm text-white w-full my-2`}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
