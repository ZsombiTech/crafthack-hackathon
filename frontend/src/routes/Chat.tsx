import React, { useEffect, useRef, useState } from "react";
import { ChatComp } from "../components/Message";
import { getChat, postChat } from "../api/chat";
import { useNavigate } from "react-router-dom";
import { postParticipation } from "../api/event";
import { useSelector } from "react-redux";
import { makeTeams } from "../api/apply";

interface Message {
  message: string;
  isFromUser: boolean;
}

export default function Chat() {
  const navigation = useNavigate();
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesContainer = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 1270;
  const [waiting, setWaiting] = useState<boolean>(false);
  const hackathon = useSelector((state: any) => state.hackathon);

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTo(
        0,
        messagesContainer.current.scrollHeight
      );
    }
  }, [currentMessages]);

  useEffect(() => {
    if (!hackathon) {
      navigation("/");
    }
    const getMessages = async () => {
      const messages = await getChat();
      const currentMessage = {
        message: messages.data.message,
        isFromUser: false,
      };
      setCurrentMessages([...currentMessages, currentMessage]);
    };
    getMessages();
  }, []);

  const handleSendMessage = async () => {
    setWaiting(true);
    const messagess = [];
    const currentMessagesss = {
      message: message,
      isFromUser: true,
    };
    messagess.push(currentMessagesss);

    setMessage("");

    const { data } = await postChat(message);
    const currentMessage = {
      message: data.message,
      isFromUser: false,
    };
    if (data.message.includes("<END_CONVERSATION>")) {
      await postParticipation(hackathon.id, {
        event_id: hackathon.id,
        format: "offline",
        needs_teammates: true,
        description: "I need teammates",
      });
      currentMessage.message = currentMessage.message.replace(
        "<END_CONVERSATION>",
        ""
      );
      setTimeout(() => {
        navigation("/dashboard");
      }, 5000);
    }

    messagess.push(currentMessage);

    setCurrentMessages([...currentMessages, ...messagess]);
    setWaiting(false);
  };

  return (
    <div className={`w-full ${isMobile ? "ml-0" : "ml-40 md:ml-48"}`}>
      <h1 className="text-center text-3xl font-semibold my-10">
        Tell us about yourself
      </h1>
      <div className="flex items-center justify-center">
        <div
          className="h-[30rem] w-11/12 overflow-y-scroll rounded-lg bg-dark-lightest border-2 border-accent"
          ref={messagesContainer}
        >
          {currentMessages.map((message, idx) => (
            <ChatComp
              isFromUser={message.isFromUser}
              message={message.message}
              key={idx}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center mt-5">
        <div className="flex items-center justify-center w-11/12">
          <input
            type="text"
            className="w-full rounded-lg border-2 border-accent px-5 py-3 bg-dark-lightest mr-8 focus:outline-none"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {waiting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
            </div>
          ) : (
            <button
              className="py-3 px-8 rounded-lg bg-accent text-background font-semibold"
              onClick={() => {
                const messageSend = {
                  message,
                  isFromUser: true,
                };
                setCurrentMessages([...currentMessages, messageSend]);
                handleSendMessage();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const messageSend = {
                    message,
                    isFromUser: true,
                  };
                  setCurrentMessages([...currentMessages, messageSend]);
                  handleSendMessage();
                }
              }}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
