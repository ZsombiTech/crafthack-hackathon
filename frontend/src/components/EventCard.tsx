import React from "react";
import { setHackathon } from "../redux/actions/userAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  img: string;
  name: string;
  format: string;
  prize: string;
  participants: string;
}

export default function EventCard({
  img,
  name,
  format,
  prize,
  participants,
}: EventCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 1270;

  const handleChooseHackathon = (hackathon: string) => {
    dispatch(setHackathon(hackathon));
    navigate("/dashboard");
  };

  return (
    <div
      className={`w-full flex items-center mt-4 p-6 rounded-lg ${
        !isMobile && "bg-dark-lightest border-primary border-2"
      }`}
      onClick={() => handleChooseHackathon(name)}
    >
      <img src={img} alt="Event" className="w-64" />
      <div className="flex flex-col justify-start items-center ml-8 shrink-0">
        <div className="w-full">
          <h1 className="text-background text-2xl font-semibold">{name}</h1>
          <p className="text-background text-sm font-semibold">{format}</p>
        </div>
        <div className="mt-12 flex justify-start flex-col w-full">
          <p className="text-background text-lg font-semibold text-start">
            Up to {prize}
          </p>
          <p className="text-background text-lg font-semibold text-start">
            {participants} participants
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end items-center">
        <div className="flex flex-col p-4 px-6 rounded-lg justify-start items-center ml-8 border-2 border-accent shadow-buttonShadowJoin">
          <div className="flex items-center w-full">
            <p className="text-accent font-semibold text-5xl">09</p>
            <p className="ml-3 font-semibold text-background text-xl">hours</p>
          </div>
          <div className="flex items-center w-full">
            <p className="text-accent font-semibold text-5xl">41</p>
            <p className="ml-3 font-semibold text-background text-xl">
              minutes
            </p>
          </div>
          <div className="flex items-center w-full">
            <p className="text-accent font-semibold text-5xl">37</p>
            <p className="ml-3 font-semibold text-background text-xl">
              seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
