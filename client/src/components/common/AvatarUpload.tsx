import React, { useState } from "react";

const AvatarUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById("avatar").click();
  };

  return (
    <div className=" transform w-20 h-20 sm:w-24 sm:h-24 flex rounded-full overflow-hidden border-4 border-red">
      {!preview && (
        <img
          src="/images/avatar.jpg"
          alt="Avatar Preview"
          height={150}
          onClick={triggerFileUpload}
          className="w-full hover:opacity-80 transition ease-linear h-full object-cover rounded-lg block hover:cursor-pointer"
          width={150}
        />
      )}
      <input
        type="file"
        hidden
        className=""
        id="avatar"
        onChange={handleFileChange}
      />
      {preview && (
        <>
          <img
            onClick={triggerFileUpload}
            src={preview}
            className="w-full hover:opacity-80 transition ease-linear h-full object-cover rounded-lg block hover:cursor-pointer"
            alt="Avatar Preview"
            width={150}
          />
        </>
      )}
    </div>
  );
};

export default AvatarUpload;
