import React from "react";
import LogoLogin from "../assets/images/logoLogin.svg";
import MenuIcon from "../assets/images/menuIcon.svg";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const handleSignOut = () => {};

  return (
    <div className="top-0 left-0 h-screen w-48  absolute bg-dark-lightest">
      <img
        src={LogoLogin}
        alt="CraftSphere"
        className="w-24 md:w-28 mt-8 mx-auto"
      />
      <div className="w-full h-px bg-background mt-8 mx-auto"></div>
      <div className="flex flex-col items-start ml-5 md:ml-5 w-full mt-8">
        <Link
          to="/"
          className={`flex items-center mt-3 w-3/4 justify-start py-1.5 pl-2 md:pl-5 rounded-md hover:bg-accent ${
            location.pathname === "/" ? "bg-accent" : ""
          }`}
        >
          <img src={MenuIcon} alt="Menu" className="w-4" />
          <p className="text-background font-semibold text-sm ml-2">
            Hackathons
          </p>
        </Link>
        <Link
          to="/attendees"
          className={`flex items-center mt-3 w-3/4 py-1.5 justify-start pl-2 md:pl-5 rounded-md hover:bg-accent ${
            location.pathname === "/attendees" ? "bg-accent" : ""
          }`}
        >
          <img src={MenuIcon} alt="Menu" className="w-4" />
          <p className="text-background font-semibold text-sm ml-2">
            Attendees
          </p>
        </Link>
      </div>
      <div className="bottom-0 absolute mb-8 w-full">
        <div className="flex flex-col items-start ml-5 md:ml-5 w-full mt-8">
          <Link
            to="/settings"
            className={`flex items-center w-3/4 py-1.5 justify-start pl-2 md:pl-5 rounded-md hover:bg-accent ${
              location.pathname === "/settings" ? "bg-accent" : ""
            }`}
          >
            <img src={MenuIcon} alt="Menu" className="w-4" />
            <p className="text-background font-semibold text-sm ml-2">
              Settings
            </p>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center mt-4 w-3/4 py-1.5 justify-start pl-2 md:pl-5 rounded-md hover:bg-accent"
          >
            <img src={MenuIcon} alt="Menu" className="w-4" />
            <p className="text-background font-semibold text-sm ml-2">
              Sign out
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
