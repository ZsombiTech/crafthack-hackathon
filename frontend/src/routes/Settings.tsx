import React from "react";
import { useSelector } from "react-redux";

export default function Settings() {
  const userProfile = useSelector((state: any) => state.userProfile);
  return (
    <div className="w-full ml-40 md:ml-48">
      <h1 className="text-4xl font-bold text-background text-center mt-10">
        Settings
      </h1>

      <div className="flex items-center justify-center mt-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-background">Name</h1>
          <h1 className="text-xl font-semibold text-background">
            {userProfile ? userProfile.name : ""}
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center ml-10">
          <h1 className="text-2xl font-bold text-background">Email</h1>
          <h1 className="text-xl font-semibold text-background">
            {userProfile ? userProfile.email : ""}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center mt-10">
        <h1 className="text-2xl font-bold text-background">Are you a staff?</h1>
        <h1 className="ml-4 text-xl font-semibold text-background">
          {userProfile && userProfile.staff === true ? "Yes" : "No"}
        </h1>
      </div>
    </div>
  );
}
