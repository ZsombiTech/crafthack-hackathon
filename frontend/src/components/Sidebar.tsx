import React, { useState } from "react";
import LogoLogin from "../assets/images/logoLogin.svg";
import MenuIcon from "../assets/images/menuIcon.svg";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth < 900;
  const location = useLocation();
  const handleSignOut = () => {};

  return (
    <div
      className={`top-0 left-0 h-[100vh] md:h-screen ${
        isOpen ? "w-full" : "w-12"
      } lg:w-48 absolute bg-dark-lightest`}
    >
      {isOpen ? (
        <div
          className="lg:hidden flex justify-end items-center mt-5 mr-5"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="
                    w-6
                    h-6
                    cursor-pointer
                    text-background
                    hover:text-accent
                    "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 10l4.146-4.146a.5.5 0 10-.708-.708L9.293 9.293 5.147 5.147a.5.5 0 00-.708.708L8.293 10l-4.146 4.146a.5.5 0 00.708.708L9.293 10l4.146 4.146a.5.5 0 00.708-.708L10.293 10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <div
          className="lg:hidden flex justify-center items-center mt-5"
          onClick={() => setIsOpen(true)}
        >
          <svg
            className="w-6 h-6 cursor-pointer text-background hover:text-accent"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h12a1 1 0 100-2H4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      {(!isMobile || isOpen) && (
        <>
          <img
            src={LogoLogin}
            alt="CraftSphere"
            className="w-24 md:w-28 mt-8 mx-auto"
          />
          <div className="w-full h-px bg-background mt-8 mx-auto"></div>
          <div className="lg:visible flex flex-col items-start ml-5 md:ml-5 w-full mt-8">
            <Link
              to="/"
              className={`flex items-center mt-3 w-3/4 justify-start py-1.5 pl-2 md:pl-5 rounded-md hover:bg-accent ${
                location.pathname === "/" ? "bg-accent" : ""
              }`}
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
                onClick={() => setIsOpen(false)}
              >
                <img src={MenuIcon} alt="Menu" className="w-4" />
                <p className="text-background font-semibold text-sm ml-2">
                  Settings
                </p>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="flex items-center mt-4 w-3/4 py-1.5 justify-start pl-2 md:pl-5 rounded-md hover:bg-accent"
              >
                <img src={MenuIcon} alt="Menu" className="w-4" />
                <p className="text-background font-semibold text-sm ml-2">
                  Sign out
                </p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
