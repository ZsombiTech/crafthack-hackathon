import React, { useEffect, useState } from "react";
import AttendeeCard from "../components/AttendeeCard";
import { getAllParticipantsForEvent } from "../api/event";
import { useSelector } from "react-redux";
import { getByUserId } from "../api/user";
import LoadingFullPage from "../components/LoadingFullPage";
import { useNavigate } from "react-router-dom";

export default function Attendees() {
  const navigation = useNavigate();
  const isMobile = window.innerWidth < 1270;
  const [attendees, setAttendees] = useState<any>([]);
  const hackathon = useSelector((state: any) => state.hackathon);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);

  useEffect(() => {
    if (!hackathon) {
      navigation("/");
    }
    if (hackathon) {
      const getAttendees = async () => {
        setIsWaiting(true);
        const userIds = [];
        const attendees = [];
        const { data } = await getAllParticipantsForEvent(hackathon.id);
        for (let i = 0; i < data.attendees.length; i++) {
          userIds.push(data.attendees[i].__data__.user);
        }
        for (let i = 0; i < userIds.length; i++) {
          const { data } = await getByUserId(userIds[i]);
          attendees.push(data);
        }
        setAttendees(attendees);
        setIsWaiting(false);
      };
      getAttendees();
    }
  }, []);

  return (
    <>
      {isWaiting && <LoadingFullPage />}
      <div className={`w-full ${isMobile ? "ml-0" : "ml-40 md:ml-48"}`}>
        <h1 className="text-center text-3xl font-semibold my-10">Attendees</h1>
        <div className="flex justify-center items-center mt-2">
          <div className="eventcontainerscroll overflow-y-scroll mt-3 h-[34rem] w-11/12 bg-dark-lightest border-2 border-primary rounded-lg px-5">
            <div className="flex justify-around items-center w-full mt-4">
              <h1 className="text-background font-semibold text-lg">Name</h1>
              <h1 className="text-background font-semibold text-lg">Status</h1>
              <h1 className="text-background font-semibold text-lg">Email</h1>
            </div>
            {attendees &&
              attendees.map((attendee: any, idx: number) => (
                <AttendeeCard
                  name={attendee.name}
                  format={"offline"}
                  email={attendee.email}
                  key={idx}
                />
              ))}
            {attendees && attendees.length === 0 && (
              <h1 className="mt-5 text-background font-semibold text-lg text-center w-full">
                No attendees yet
              </h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
