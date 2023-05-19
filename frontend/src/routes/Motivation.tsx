import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import LoadingFullPage from "../components/LoadingFullPage";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getMotivationAPI = async () => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          "I am at a hackathon and I would like to win it. I am starting lose my motivation and I would need to motivation to continue the competiton. Please tell me a few motivating quotes that will encourage me. Only tell me ONE!",
      },
    ],
  });

  const motivation = completion.data.choices[0].message!.content;

  return motivation;
};

export default function Motivation() {
  const [motivation, setMotivation] = useState<string>("");
  const isMobile = window.innerWidth < 1270;
  const [isWaiting, setWaiting] = useState<boolean>(true);

  useEffect(() => {
    setWaiting(true);
    const getMotivation = async () => {
      const motivation = await getMotivationAPI();
      setMotivation(motivation);
      setWaiting(false);
    };
    getMotivation();
  }, []);

  return (
    <>
      {isWaiting && <LoadingFullPage />}
      <div className={`w-full ${isMobile ? "ml-0" : "ml-40 md:ml-48"}`}>
        <h1 className="text-center text-3xl font-semibold my-10">
          Motivation for the challenge
        </h1>
        <div className="flex flex-col items-center justify-center mt-24">
          <p className="w-3/4 text-background text-center text-xl">
            {motivation}
          </p>
          <button
            className="rounded-lg mt-10 bg-primary text-background font-semibold px-5 py-2"
            onClick={() => {
              setWaiting(true);
              const getMotivation = async () => {
                const motivation = await getMotivationAPI();
                setMotivation(motivation);
                setWaiting(false);
              };
              getMotivation();
            }}
          >
            Get another motivation
          </button>
        </div>
      </div>
    </>
  );
}
