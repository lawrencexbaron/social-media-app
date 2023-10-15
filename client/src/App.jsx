import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import SinglePost from "./components/Posts/SinglePost";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Settings from "./components/Settings/Settings";

function App() {
  return (
    <div className='h-full w-full bg-gray-100 sm:min-h-screen flex content-center'>
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
