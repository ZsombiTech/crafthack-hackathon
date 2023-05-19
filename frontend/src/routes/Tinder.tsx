import React, { useEffect, useState } from "react";
import TinderCard from "../components/TinderCard";
import { getMatches, makeTeams } from "../api/apply";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Tinder() {
  const navigation = useNavigate();
  const isMobile = window.innerWidth < 1270;
  const [matches, setMatches] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const hackathon = useSelector((state: any) => state.hackathon);

  useEffect(() => {
    if (!hackathon) {
      navigation("/");
    }
    makeTeams();
  });

  useEffect(() => {
    const getMatches2 = async () => {
      const { data } = await getMatches();
      setMatches(data.teammates);
    };
    getMatches2();
  }, []);
  return (
    <div
      className={`w-full ${
        isMobile ? "ml-0" : "ml-40 md:ml-48"
      } flex justify-center items-center`}
    >
      {matches.length > 0 && (
        <TinderCard
          name={matches[currentCard].name}
          job={matches[currentCard].work}
          image={`https://avatars.githubusercontent.com/u/561482${Math.floor(
            Math.random() * 100
          )}?v=4`}
          description={matches[currentCard].introduction}
          stack={matches[currentCard].stack}
          age={matches[currentCard].age}
          increaseCardCounter={() => {
            if (currentCard < matches.length - 1)
              setCurrentCard(currentCard + 1);
          }}
        />
      )}
    </div>
  );
}
