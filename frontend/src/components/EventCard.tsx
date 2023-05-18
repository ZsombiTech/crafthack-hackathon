import React, { useState } from "react";
import { setHackathon } from "../redux/actions/userAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllParticipations } from "../api/event";
import LoadingFullPage from "./LoadingFullPage";

interface EventCardProps {
  img: string;
  name: string;
  format: string;
  prize: string;
  participants: string;
  startTime: number;
  endTime: number;
  isUpcoming: boolean;
  id: number;
}

const calculateTimeLeftFromToday = (startTime: number) => {
  const currentDate = new Date();
  const targetDate = new Date(startTime * 1000);

  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const months = Math.floor(timeDiff / (30 * 24 * 60 * 60 * 1000));
  const days = Math.floor((timeDiff / (24 * 60 * 60 * 1000)) % 30);

  return { months, days };
};

const calculateTimeLeft = (endTime: number) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDifference = currentTimestamp - endTime;

  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  return {
    hours,
    minutes,
    seconds,
  };
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
  id,
}: EventCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 1270;
  const timeLeftMonth = calculateTimeLeftFromToday(startTime);
  const timeLeft = calculateTimeLeft(endTime);
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseHackathon = async () => {
    setIsLoading(true);
    dispatch(
      setHackathon({
        id,
        name,
        format,
        prize,
        participants,
        startTime,
        endTime,
      })
    );
    const { data } = await getAllParticipations();
    setIsLoading(false);
    if (data.length === 0) {
      navigate("/chat");
      return;
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].event.__data__.event === id) {
          navigate("/dashboard");
          return;
        }
      }
      navigate("/chat");
      return;
    }
  };

  return (
    <>
      {isLoading && <LoadingFullPage />}

      <div
        className={`w-full flex items-center mt-4 p-6 rounded-lg ${
          !isMobile && "bg-dark-lightest border-primary border-2"
        }`}
        onClick={() => {
          handleChooseHackathon();
        }}
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
                    days
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
    </>
  );
}
