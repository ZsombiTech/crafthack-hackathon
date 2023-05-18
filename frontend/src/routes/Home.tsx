import React, { useEffect } from "react";
import EventCard from "../components/EventCard";
import CraftHack from "../assets/images/craftHack.png";
import JunctionX from "../assets/images/junctionX.png";
import { getUserProfile } from "../api/user";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.userProfile);
  useEffect(() => {
    if (!userProfile) {
      getUserProfile().then((user) => {
        console.log(user);
      });
    }
  }, [userProfile]);

  const isMobile = window.innerWidth < 1270;

  return (
    <div
      className={`w-full mx-24 my-3 ${
        isMobile ? "ml-0 mx-0" : "ml-40 md:ml-48"
      }`}
    >
      <div className="flex w-full justify-center lg:justify-end items-center mt-8">
        <button className="bg-primary text-background font-semibold text-sm py-1 px-5 rounded-md shadow-buttonShadowHost hover:bg-accent-light">
          Host a Hackathon
        </button>
        <button className="bg-accent text-background font-semibold text-sm py-1 px-5 rounded-md shadow-buttonShadowJoin hover:bg-accent-light ml-4">
          Join a hackathon
        </button>
      </div>
      <div className="ml-2 lg:ml-24 mt-8 3xl:mt-16">
        <h1 className="text-background text-3xl font-semibold">Ongoing</h1>
        <div className="w-full h-px bg-background mt-3 mx-auto"></div>
        <div className="eventcontainerscroll overflow-y-scroll h-64 w-full flex flex-col items-center justify-start pr-2">
          <EventCard
            img={CraftHack}
            name="CraftHack 2023"
            format="Hybrid"
            prize="1000$"
            participants="100"
          />
        </div>
      </div>
      <div className="ml-2 lg:ml-24 mt-5">
        <h1 className="text-background text-3xl font-semibold">Upcoming</h1>
        <div className="w-full h-px bg-background mt-3 mx-auto"></div>

        <div className="eventcontainerscroll overflow-y-scroll h-64 w-full flex flex-col items-center justify-start pr-2">
          <EventCard
            img={JunctionX}
            name="JunctionX Budapest 2023"
            format="Hybrid"
            prize="8000$"
            participants="234"
          />
        </div>
      </div>
    </div>
  );
}
