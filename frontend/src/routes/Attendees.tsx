import React from "react";
import AttendeeCard from "../components/AttendeeCard";

export default function Attendees() {
  const isMobile = window.innerWidth < 1270;

  return (
    <div className={`w-full ${isMobile ? "ml-10" : "ml-40 md:ml-48"}`}>
      <h1 className="text-center text-3xl font-semibold my-10">Attendees</h1>
      <div className="flex justify-center items-center mt-2">
        <div className="eventcontainerscroll overflow-y-scroll mt-3 h-[34rem] w-11/12 bg-dark-lightest border-2 border-primary rounded-lg px-5">
          <div className="flex justify-around items-center w-full mt-4">
            <h1 className="text-background font-semibold text-lg">Name</h1>
            <h1 className="text-background font-semibold text-lg">Status</h1>
            <h1 className="text-background font-semibold text-lg">Email</h1>
          </div>
          <AttendeeCard
            name="Zsombor Horvath"
            format="offline"
            email="horvathzsombor2005@gmail.com"
          />
          <AttendeeCard
            name="Gergely Daniel"
            format="online"
            email="gdani05@gmail.com"
          />
          <AttendeeCard
            name="Balogh Denes"
            format="offline"
            email="denes.xxx.porn@gmail.com"
          />
          <AttendeeCard
            name="Balogh Denes"
            format="offline"
            email="denes.xxx.porn@gmail.com"
          />
        </div>
      </div>
    </div>
  );
}
