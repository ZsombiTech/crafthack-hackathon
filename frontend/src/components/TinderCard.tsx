import React from "react";
import { likeMatch } from "../api/apply";

interface TinderCardProps {
  name: string;
  job: string;
  image: string;
  description: string;
  stack: string[];
  age: number;
  increaseCardCounter: () => void;
  id: number;
}

export default function TinderCard({
  name,
  job,
  image,
  description,
  stack,
  age,
  increaseCardCounter,
  id,
}: TinderCardProps) {
  const acceptCard = async () => {
    await likeMatch({
      targetUid: id,
      likes: true,
    });
    increaseCardCounter();
  };

  const rejectCard = async () => {
    await likeMatch({
      targetUid: id,
      likes: false,
    });
    increaseCardCounter();
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <img className="w-36 rounded-full" src={image} alt="profile" />
      <div className="flex flex-col items-center mt-5">
        <h1 className="text-3xl font-semibold">{name}</h1>
        <h1 className="text-lg font-semibold mt-2">{job}</h1>
        <h1 className="text-lg font-semibold mt-1">{age} years old</h1>
      </div>
      <div className="flex items-centerm mt-3">
        {stack.map((tag, idx) => (
          <div
            className="bg-accent rounded-lg px-2 py-1 mx-1 mb-2 md:mb-0"
            key={idx}
          >
            <p className="text-background text-sm">{tag}</p>
          </div>
        ))}
      </div>
      <div className="w-1/2 text-center mt-6">{description}</div>
      <div className="flex items-center mt-8 gap-10">
        <button
          type="button"
          className="flex justify-center items-center bg-red hover:bg-red-lightest text-white font-bold p-4 rounded-full"
          onClick={rejectCard}
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
          onClick={acceptCard}
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
  );
}
