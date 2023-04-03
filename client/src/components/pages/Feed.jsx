import React from "react";
import { useNavigate } from "react-router-dom";
import Base from "../layout/Base";

function Feed() {
  return (
    <>
      <Base>
        <div className="bg-white rounded px-6 py-8">
          <h1 className="text-2xl font-bold mb-4">Feed</h1>
          <p className="text-gray-700">This is the feed page.</p>
        </div>
      </Base>
    </>
  );
}

export default Feed;
