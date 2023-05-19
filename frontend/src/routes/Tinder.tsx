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
      const matchesArr = [];
      const { data } = await getMatches();
      if (data.teammates && data.teammates.length > 0) {
        for (let i = 0; i < data.teammates.length; i++) {
          const keys = Object.keys(data.teammates[i]);
          matchesArr.push({
            id: keys[0],
            ...data.teammates[i][keys[0]],
          });
        }
        setMatches(matchesArr);
      }
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
          name={matches[currentCard].name ?? "Kiram Doe"}
          job={matches[currentCard].work ?? "Software Engineer"}
          image={`https://avatars.githubusercontent.com/u/561482${Math.floor(
            Math.random() * 100
          )}?v=4`}
          description={
            matches[currentCard].introduction ??
            "I am a cool persoN, I like to do cool things"
          }
          stack={matches[currentCard].stack ?? []}
          age={matches[currentCard].age ?? 34}
          increaseCardCounter={() => {
            if (currentCard < matches.length - 1)
              setCurrentCard(currentCard + 1);
          }}
          id={matches[currentCard].id}
        />
      )}
    </div>
  );
}
