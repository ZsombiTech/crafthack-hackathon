import React from "react";
import TinderCard from "../components/TinderCard";

const developerJobs = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "Cloud Engineer",
  "Cloud Architect",
];

export default function Tinder() {
  const isMobile = window.innerWidth < 1270;
  return (
    <div
      className={`w-full ${
        isMobile ? "ml-0" : "ml-40 md:ml-48"
      } flex justify-center items-center`}
    >
      <TinderCard
        name="Siddharth Singh"
        job={developerJobs[Math.floor(Math.random() * developerJobs.length)]}
        image="https://avatars.githubusercontent.com/u/56148219?v=4"
        description="qwdqwd qwdqw djqwd wqdqwjdnqwd wqdiqwd wqdiqwdn qwd"
      />
    </div>
  );
}
