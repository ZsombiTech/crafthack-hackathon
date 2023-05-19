import React, { useEffect, useState } from "react";
import LoadingFullPage from "../components/LoadingFullPage";

export default function LastMinute() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = window.innerWidth < 1270;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {isLoading && <LoadingFullPage />}
      <div className={`w-full ${isMobile ? "ml-0" : "ml-40 md:ml-48"}`}>
        <h1 className="text-center text-3xl font-semibold mt-10 mb-3">
          Last Minute Places
        </h1>
        <div className="flex items-center justify-center">
          <p className="w-1/4 text-sm text-center">
            These are available places for offline hackathons after participants
            didn't come...
          </p>
        </div>
        {!isLoading && (
          <div className="grid grid-cols-4 gap-4 mx-10 mt-10">
            <div
              className="w-full rounded-lg p-5 bg-dark-lightest hover:cursor-pointer hover:bg-dark-light"
              onClick={() => {
                alert("Registered for the event!");
              }}
            >
              <h1 className="font-bold text-center text-2xl">JunctionY</h1>
              <p className="text-center text-lg">Budapest</p>
              <p className="text-center text-lg">2023. 05. 08. 16: 30</p>
              <h1 className="text-center">3 FREE SPACES</h1>
            </div>
            <div
              className="w-full rounded-lg p-5 bg-dark-lightest hover:cursor-pointer hover:bg-dark-light"
              onClick={() => {
                alert("Registered for the event!");
              }}
            >
              <h1 className="font-bold text-center text-2xl">JunctionK</h1>
              <p className="text-center text-lg">Debrecen</p>
              <p className="text-center text-lg">2023. 09. 08. 12: 30</p>
              <h1 className="text-center">1 FREE SPACES</h1>
            </div>

            <div
              className="w-full rounded-lg p-5 bg-dark-lightest hover:cursor-pointer hover:bg-dark-light"
              onClick={() => {
                alert("Registered for the event!");
              }}
            >
              <h1 className="font-bold text-center text-2xl">JunctionP</h1>
              <p className="text-center text-lg">Budapest</p>
              <p className="text-center text-lg">2023. 10. 08. 13: 30</p>
              <h1 className="text-center">1 FREE SPACES</h1>
            </div>
            <div
              className="w-full rounded-lg p-5 bg-dark-lightest hover:cursor-pointer hover:bg-dark-light"
              onClick={() => {
                alert("Registered for the event!");
              }}
            >
              <h1 className="font-bold text-center text-2xl">JunctionLL</h1>
              <p className="text-center text-lg">Gyor</p>
              <p className="text-center text-lg">2024. 05. 08. 16: 30</p>
              <h1 className="text-center">30 FREE SPACES</h1>
            </div>
            <div
              className="w-full rounded-lg p-5 bg-dark-lightest hover:cursor-pointer hover:bg-dark-light"
              onClick={() => {
                alert("Registered for the event!");
              }}
            >
              <h1 className="font-bold text-center text-2xl">JunctionY</h1>
              <p className="text-center text-lg">Budapest</p>
              <p className="text-center text-lg">2023. 05. 08. 16: 30</p>
              <h1 className="text-center">3 FREE SPACES</h1>
            </div>
            <div
              className="w-full rounded-lg p-5 bg-dark-lightest"
              onClick={() => {
                alert("Registered for the event!");
              }}
            >
              <h1 className="font-bold text-center text-2xl">JunctionFF</h1>
              <p className="text-center text-lg">Kobanya</p>
              <p className="text-center text-lg">2023. 12. 08. 16: 35</p>
              <h1 className="text-center">33 FREE SPACES</h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
