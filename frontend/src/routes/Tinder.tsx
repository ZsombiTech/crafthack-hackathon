import React from "react";

export default function Tinder() {
  const isMobile = window.innerWidth < 1270;
  return (
    <div
      className={`w-full ${
        isMobile ? "ml-0" : "ml-40 md:ml-48"
      } flex justify-center items-center`}
    >
      <div className="flex flex-col items-center mt-10">
        <img
          className="w-36 rounded-full"
          src="https://avatars.githubusercontent.com/u/55942632?v=4"
          alt="profile"
        />
        <div className="flex flex-col items-center mt-5">
          <h1 className="text-3xl font-semibold">Siddharth Singh</h1>
          <h1 className="text-lg font-semibold">Full Stack Developer</h1>
        </div>
        <div className="w-1/2 text-center mt-6">
          qwdqwd qwdqw djqwd wqdqwjdnqwd wqdiqwd wqdiqwdn qwd
        </div>
        <div className="flex items-center mt-8 gap-10">
          <button
            type="button"
            className="flex justify-center items-center bg-red hover:bg-red-lightest text-white font-bold p-4 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex justify-center items-center bg-green hover:bg-green-lightest text-white font-bold p-4 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
