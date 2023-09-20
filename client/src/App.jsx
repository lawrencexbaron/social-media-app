import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Feed from "./components/Feed/Feed";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='h-full w-full bg-gray-100 min-h-screen flex content-center'>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/feed' element={<Feed />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
