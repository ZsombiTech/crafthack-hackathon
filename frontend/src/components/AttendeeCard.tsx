import React from "react";

interface AttendeeCardProps {
  name: string;
  format: string;
  email: string;
}

const abbreviateStringWithThreeDot = (str: string) => {
  const isMobile = window.innerWidth < 1270;
  const counter = isMobile ? 5 : 20;
  if (str.length > counter) {
    return str.slice(0, counter) + "...";
  }
  return str;
};

export default function AttendeeCard({
  name,
  format,
  email,
}: AttendeeCardProps) {
  return (
    <div className="mt-3 flex items-center rounded-lg justify-around border-2 border-accent shadow-buttonShadowJoin w-full px-3 py-3">
      <div className="w-1/3 flex items-center justify-center">{name}</div>
      <h1 className="w-1/3 flex items-center justify-center">{format}</h1>
      <h1 className="w-1/3 flex items-center justify-center">
        {abbreviateStringWithThreeDot(email)}
      </h1>
    </div>
  );
}
