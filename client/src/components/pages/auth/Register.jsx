import React, { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Label from "../../common/Label";
import { Link } from "react-router-dom";
import { register } from "../../utils/api/Auth";
import Spinner from "../../common/Spinner";
import axios from "axios";

function Register() {
  const BASE_URL = "http://localhost:4000";
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const register = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, data);
      console.log(res.data);
      setSuccess(true);
      setError(null);
      clearForm();
    } catch (err) {
      console.log(err.response.data.messages);
      setError(err.response.data.messages);
      setSuccess(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    }
    register({
      email,
      firstname,
      lastname,
      username,
      password,
      confirmPassword,
    });
  };

  return (
    <>
      <div className="mx-auto bg-white shadow-md px-6 py-8 w-3/4 sm:w-1/4 h-3/4 mt-10">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <Spinner isLoading={isLoading} />
        {error && (
          <div
            className="bg-red-100 border flex flex-col border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
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

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              className="mb-2"
            />
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              className="mb-2"
            />
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-2"
            />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="mb-2"
            />

            <Label htmlFor="password">Confirm Password</Label>
            <Input
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              className="mb-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Register</Button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/login"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
