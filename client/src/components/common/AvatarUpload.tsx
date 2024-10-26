import React, { useState } from "react";

interface AvatarUploadProps {
  onUpload: (file: File) => void;
}

const AvatarUpload = ({ onUpload }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
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
    const fileInput = document.getElementById("avatar");
    if (fileInput) {
      fileInput.click();
    }
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
            src={typeof preview === 'string' ? preview : undefined}
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
