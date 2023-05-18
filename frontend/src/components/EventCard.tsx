import React from "react";
import { setHackathon } from "../redux/actions/userAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllParticipations } from "../api/event";

interface EventCardProps {
  img: string;
  name: string;
  format: string;
  prize: string;
  participants: string;
  startTime: number;
  endTime: number;
  isUpcoming: boolean;
}

const calculateTimeLeftFromToday = (startTime: number, endTime: number) => {
  const today = new Date();
  const start = new Date(startTime * 1000);
  const end = new Date(endTime * 1000);
  const timeLeft = {
    days: 0,
    months: 0,
  };
  if (today.getMonth() === start.getMonth()) {
    timeLeft.days = end.getDate() - today.getDate();
  } else {
    timeLeft.days = end.getDate() + (start.getDate() - today.getDate());
    timeLeft.months = end.getMonth() - today.getMonth();
  }

  return timeLeft;
};

const calculateTimeLeft = (startTime: number, endTime: number) => {
  const today = new Date();
  const start = new Date(startTime * 1000);
  const end = new Date(endTime * 1000);
  const timeLeft = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (today.getMonth() === start.getMonth()) {
    timeLeft.hours = end.getHours() - today.getHours();
    timeLeft.minutes = end.getMinutes() - today.getMinutes();
    timeLeft.seconds = end.getSeconds() - today.getSeconds();
  } else {
    timeLeft.hours = end.getHours() + (start.getHours() - today.getHours());
    timeLeft.minutes =
      end.getMinutes() + (start.getMinutes() - today.getMinutes());
    timeLeft.seconds =
      end.getSeconds() + (start.getSeconds() - today.getSeconds());
  }

  return timeLeft;
};

export default function EventCard({
  img,
  name,
  format,
  prize,
  participants,
  startTime,
  endTime,
  isUpcoming,
}: EventCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 1270;
  const timeLeftMonth = calculateTimeLeftFromToday(startTime, endTime);
  const timeLeft = calculateTimeLeft(startTime, endTime);

  const handleChooseHackathon = async (hackathon: string) => {
    const response = await getAllParticipations();
    console.log(response);
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
          {isUpcoming ? (
            <>
              <div className="flex items-center w-full">
                <p className="text-accent font-semibold text-5xl">
                  {timeLeftMonth.months}
                </p>
                <p className="ml-3 font-semibold text-background text-xl">
                  months
                </p>
              </div>
              <div className="flex items-center w-full">
                <p className="text-accent font-semibold text-5xl">
                  {timeLeftMonth.days}
                </p>
                <p className="ml-3 font-semibold text-background text-xl">
                  daus
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center w-full">
                <p className="text-accent font-semibold text-5xl">
                  {Math.abs(timeLeft.hours)}
                </p>
                <p className="ml-3 font-semibold text-background text-xl">
                  hours
                </p>
              </div>
              <div className="flex items-center w-full">
                <p className="text-accent font-semibold text-5xl">
                  {Math.abs(timeLeft.minutes)}
                </p>
                <p className="ml-3 font-semibold text-background text-xl">
                  minutes
                </p>
              </div>
              <div className="flex items-center w-full">
                <p className="text-accent font-semibold text-5xl">
                  {Math.abs(timeLeft.seconds)}
                </p>
                <p className="ml-3 font-semibold text-background text-xl">
                  seconds
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
