import React, { useState } from "react";
import Base from "../layout/Base";

function Settings() {
  const [activeSetting, setActiveSetting] = useState("editProfile");

  const settings = [
    { id: "editProfile", label: "Edit Profile" },
    { id: "changePassword", label: "Change Password" },
    { id: "activityLogs", label: "Activity Logs" },
    { id: "emailNotifications", label: "Email Notifications" },
    { id: "help", label: "Help" },
  ];

  return (
    <>
      <Base>
        <div className='bg-white w-full max-w-4xl mx-auto mt-10 rounded-xl shadow-md py-8 flex'>
          <div className='w-1/3'>
            <ul>
              {settings.map((setting) => (
                <li
                  key={setting.id}
                  className={`cursor-pointer px-4 py-2 hover:border-l-4 hover:border-slate-300 ${
                    activeSetting === setting.id
                      ? "font-bold border-l-4 border-blue-500"
                      : "text-gray-700"
                  }`}
                  onClick={() => setActiveSetting(setting.id)}
                >
                  {setting.label}
                </li>
              ))}
            </ul>
          </div>
          <div className='w-2/3 border-l border-gray-200 pl-8'>
            {activeSetting === "editProfile" && (
              <div>
                <h2 className='font-bold text-xl mb-6'>Edit Profile</h2>
                <p className='w-3/4'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Assumenda hic dolor ad a, nostrum vel porro, dolores
                  voluptates esse, exercitationem voluptatum illum quod
                  architecto! Vitae aperiam mollitia quisquam quos animi?
                </p>
              </div>
            )}
            {/* Add content for other settings below */}
          </div>
        </div>
      </Base>
    </>
  );
}

export default Settings;
