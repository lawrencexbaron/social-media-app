import React, { useState } from "react";
import Base from "../layout/Base";

function Settings() {
  const [activeSetting, setActiveSetting] = useState("editProfile");

  const settings = [
    { id: "editProfile", label: "Edit Profile" },
    { id: "changePassword", label: "Change Password" },
    { id: "appsWebsites", label: "Apps and Websites" },
    { id: "emailNotifications", label: "Email Notifications" },
    { id: "pushNotifications", label: "Push Notifications" },
    { id: "manageContacts", label: "Manage Contacts" },
    { id: "privacySecurity", label: "Privacy and Security" },
    { id: "ads", label: "Ads" },
    { id: "supervision", label: "Supervision" },
    { id: "loginActivity", label: "Login Activity" },
    { id: "emailsInstagram", label: "Emails from Instagram" },
    { id: "help", label: "Help" },
  ];

  return (
    <>
      <Base>
        <div className="bg-white w-full max-w-4xl mx-auto mt-10 rounded-xl shadow-md py-8 flex">
          <div className="w-1/3">
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
          <div className="w-2/3 border-l border-gray-200 pl-8">
            {activeSetting === "editProfile" && (
              <h2 className="font-bold text-xl mb-6">Edit Profile</h2>
            )}
            {/* Add content for other settings below */}
          </div>
        </div>
      </Base>
    </>
  );
}

export default Settings;
