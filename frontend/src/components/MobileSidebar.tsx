import React from "react";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "../assets/images/menuIcon.svg";
import AttendeesIcon from "../assets/images/attendeesIcon.svg";

export default function MobileSidebar() {
  const location = useLocation();
  return (
    <div className="absolute bottom-0 bg-dark-lightest h-16 w-full flex gap-5 justify-center items-center">
      <Link
        to="/dashboard"
        className={`flex items-center mt-3 justify-start py-1.5 px-3 rounded-md hover:bg-accent ${
          location.pathname === "/dashboard" ? "bg-accent" : ""
        }`}
      >
        <img src={MenuIcon} alt="Menu" className="w-4" />
        <p className="text-background font-semibold text-sm ml-2">Dashboard</p>
      </Link>
      <Link
        to="/attendees"
        className={`flex items-center mt-3 justify-start py-1.5 px-3 rounded-md hover:bg-accent ${
          location.pathname === "/attendees" ? "bg-accent" : ""
        }`}
      >
        <img src={AttendeesIcon} alt="Menu" className="w-4" />
        <p className="text-background font-semibold text-sm ml-2">Attendees</p>
      </Link>
    </div>
  );
}
