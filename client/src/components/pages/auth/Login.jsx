import React, { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Label from "../../common/Label";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { login } from "../../utils/api/Auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:4000";
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [password, setPassword] = useState("");

  const submitLogin = async (data) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, data);
      console.log(res.data);
      setSuccess(true);
      setError(null);
      clearForm();
      // redirect to feed page after login after 3 seconds
      setTimeout(() => {
        navigate("/feed");
      }, 2000);
    } catch (err) {
      setError(err.response.data.message);
      setSuccess(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin({
      email,
      password,
    });
  };

  return (
    <>
      <div className="mx-auto bg-white shadow-md px-6 py-8 h-3/4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
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
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <p className="font-bold">Success!</p>
            <p className="block sm:inline">You are logged in!</p>
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

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="flex  items-center justify-between space-x-2">
            {/* <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Register now
            </a> */}
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/register"
            >
              Register now
            </Link>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
          <div className="flex items-center justify-end mt-2">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
