import React, { useEffect, useState } from "react";
import RecommendationCard from "../components/RecommendationCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingFullPage from "../components/LoadingFullPage";

export default function Dashboard() {
  const navigation = useNavigate();
  const [enabled, setEnabled] = useState(true);
  const isMobile = window.innerWidth < 1270;
  const hackathon = useSelector((state: any) => state.hackathon);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!hackathon) {
      navigation("/");
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {isLoading && <LoadingFullPage />}
      <div className={`w-full ${isMobile ? "ml-0" : "ml-40 md:ml-48"}`}>
        <h1 className="text-3xl text-center font-semibold mt-10">
          CraftHack 2023
        </h1>
        <div className="flex justify-center items-center mt-5">
          <h1 className="text-lg font-semibold">Search for teammates</h1>
          <label className="ml-3 inline-flex relative items-center mr-5 cursor-pointer border-2 border-primary rounded-full">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              readOnly
            />
            <div
              onClick={() => {
                setEnabled(!enabled);
              }}
              className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] ${
                enabled ? "after:bg-primary" : "after:bg-dark-light"
              } after:border-primary after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
            ></div>
          </label>
        </div>

        {enabled && !isLoading && (
          <>
            <h1 className="text-lg font-semibold ml-24 mt-12">
              Recommendations
            </h1>
            <div className="w-full px-10 mt-5 h-[30rem] overflow-y-scroll">
              <RecommendationCard
                name="Vargaking"
                tags={["UX/UI", "Frontend", "Svelte"]}
                description={
                  " Vargaking is a valuable addition to any team due to their exceptional leadership skills, strong work ethic, and ability to consistently deliver exceptional results."
                }
              />
              <RecommendationCard
                name="ZsombiTech"
                tags={["React", "Frontend", "MySQL"]}
                description={
                  " ZsombiTech is a great player because he is very smart and strong."
                }
              />
              <RecommendationCard
                name="Matyas Nyilas"
                tags={["Vue", "DevOps", "MySQL"]}
                description={
                  "Nyilas Matyas is a cool because he can play games with a controller instead of a keyboard."
                }
              />
              <RecommendationCard
                name="Blake Mccormick"
                tags={["Angular", "Backend", "MySQL"]}
                description={
                  "Blake Mccormick is an exceptional player because she is very beautiful and strong."
                }
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
