import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import SinglePost from "./components/Posts/SinglePost";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Settings from "./components/Settings/Settings";
import React from "react";

function App() {
  return (
    <div className='h-full w-full bg-gray-100 min-h-screen flex content-center'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/feed' element={<Feed />} />
            <Route path='/profile/:id' element={<Profile />} />
            <Route path='/posts/:id' element={<SinglePost />} />
            <Route path='/profile/settings' element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
