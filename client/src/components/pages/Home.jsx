import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <h1 className="bg-blue-500">Home</h1>
    </>
  );
}

export default Home;
