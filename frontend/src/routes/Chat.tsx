import React, { useEffect, useRef, useState } from "react";
import { ChatComp } from "../components/Message";
import { getChat, postChat } from "../api/chat";

interface Message {
  message: string;
  isFromUser: boolean;
}

export default function Chat() {
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesContainer = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 1270;

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTo(
        0,
        messagesContainer.current.scrollHeight
      );
    }
  }, [currentMessages]);

  useEffect(() => {
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
    setMessage("");
    const messagess = [];
    const messageSend = {
      message,
      isFromUser: true,
    };
    messagess.push(messageSend);
    const { data } = await postChat(message);
    const currentMessage = {
      message: data.message,
      isFromUser: false,
    };
    messagess.push(currentMessage);
    setCurrentMessages([...currentMessages, ...messagess]);
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
          {currentMessages.map((message) => (
            <ChatComp
              isFromUser={message.isFromUser}
              message={message.message}
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
          <button
            className="py-3 px-8 rounded-lg bg-accent text-background font-semibold"
            onClick={handleSendMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}