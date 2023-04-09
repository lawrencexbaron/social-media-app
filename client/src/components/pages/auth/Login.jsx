import React, { useState } from "react";
import TextInput from "../../common/TextInput";
import Button from "../../common/Button";
import Label from "../../common/Label";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useAuthStore } from "../../../stores/authStore";
import { login } from "../../../utils/api.jsx";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const loginMutation = useMutation(login, {
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setUser(data.data);
      setToken(data.token);
      // set success for login mutation
      loginMutation.isSuccess = true;
      // navigate after 3 seconds
      setTimeout(() => {
        navigate("/feed");
        setLoading(false);
      }, 3000);
    },
    onError: () => setLoading(false),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <>
      <div className="mx-auto bg-white shadow-md px-6 py-8 w-3/4 md:w-1/2 lg:w-1/4 h-3/4 my-10">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {loginMutation.isError && (
          <div
            className="bg-red-100 border flex flex-col border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <p className="font-bold">Error!</p>
            <p>{loginMutation.error.message}</p>
          </div>
        )}
        {loginMutation.isSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <p className="font-bold">Success!</p>
            <p className="block sm:inline">You are logged in!</p>
            <p className="block">Redirecting...</p>
          </div>
        )}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />

            <Label htmlFor="password">Password</Label>
            <TextInput
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
            <Button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-400 text-white`}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
