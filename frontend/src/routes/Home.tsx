import React, { useEffect, useState, Fragment } from "react";
import EventCard from "../components/EventCard";
import { getUserProfile } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../redux/actions/userAction";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createEvent, getAllEvents } from "../api/event";
import { Dialog, Transition } from "@headlessui/react";
import LoadingFullPage from "../components/LoadingFullPage";

interface Event {
  title: string;
  description: string;
  thumbnail: string;
  start_time: number;
  end_time: number;
  format: string;
  prize: string;
  id: number;
}

const setCookie = (
  key: any,
  value: any,
  expireDays: any,
  expireHours: any,
  expireMinutes: any,
  expireSeconds: any
) => {
  var expireDate = new Date();
  if (expireDays) {
    expireDate.setDate(expireDate.getDate() + expireDays);
  }
  if (expireHours) {
    expireDate.setHours(expireDate.getHours() + expireHours);
  }
  if (expireMinutes) {
    expireDate.setMinutes(expireDate.getMinutes() + expireMinutes);
  }
  if (expireSeconds) {
    expireDate.setSeconds(expireDate.getSeconds() + expireSeconds);
  }
  document.cookie =
    key +
    "=" +
    escape(value) +
    ";domain=" +
    window.location.hostname +
    ";path=/" +
    ";expires=" +
    expireDate.toUTCString();
};

function deleteCookie(name: string) {
  setCookie(name, "", null, null, null, 1);
}

const getAllEventsAPI = async (
  setEvents: any,
  setUpComingEvents: any,
  setLoading: any,
  navigate: any
) => {
  const events: any[] = [];
  const upComingEvents: any[] = [];
  getAllEvents()
    .then(({ data }: any) => {
      const currentDate = new Date();
      data.map((event: Event) => {
        const startDate = new Date(event.start_time * 1000);
        const endDate = new Date(event.end_time * 1000);
        endDate.setDate(endDate.getDate() + 1);
        if (startDate <= currentDate && endDate >= currentDate) {
          events.push(event);
        } else if (startDate > currentDate) {
          upComingEvents.push(event);
        }
      });
      setLoading(false);
      setEvents(events);
      setUpComingEvents(upComingEvents);
    })
    .catch((error) => {
      navigate("/");
    });
};

export default function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const userProfile = useSelector((state: any) => state.userProfile);
  const isMobile = window.innerWidth < 1270;
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventFormat, setEventFormat] = useState("");
  const [eventPrize, setEventPrize] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [upComingEvents, setUpComingEvents] = useState<Event[]>([]);
  const [loading2, setLoading2] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    setLoading2(true);
    const callAPI = async () => {
      await getAllEventsAPI(
        setEvents,
        setUpComingEvents,
        setLoading2,
        navigate
      );
    };

    callAPI();
  }, []);

  const handleCloseModal = async () => {
    const unixDateBegin = new Date(eventStartDate).getTime() / 1000;
    const unixDateEnd = new Date(eventEndDate).getTime() / 1000;
    await createEvent({
      title: eventName,
      description: eventDescription,
      thumbnail: eventImageUrl,
      start_time: unixDateBegin,
      end_time: unixDateEnd,
      format: eventFormat,
      prize: eventPrize,
    });
    await getAllEventsAPI(setEvents, setUpComingEvents, setLoading2, navigate);
    closeModal();
  };

  return (
    <>
      {loading2 && <LoadingFullPage />}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto bg-white">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-light p-6 text-left align-middle shadow-xl transition-all opacity-1">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-center leading-6 text-gray-900"
                  >
                    Create a new event
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Get started by creating a new event. You can create a
                      hackathon, a workshop, a meetup or any other type of
                      event.
                    </p>
                    <input
                      type="text"
                      className="text-dark-light w-full mt-4 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event name"
                      onChange={(e) => setEventName(e.target.value)}
                      value={eventName}
                    />
                    <input
                      type="text"
                      className="text-dark-light w-full mt-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event description"
                      onChange={(e) => setEventDescription(e.target.value)}
                      value={eventDescription}
                    />
                    <input
                      type="text"
                      className="text-dark-light w-full mt-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Image URL"
                      onChange={(e) => setEventImageUrl(e.target.value)}
                      value={eventImageUrl}
                    />
                    <p className="text-sm mt-3 font-bold">
                      Start date and time
                    </p>
                    <input
                      type="datetime-local"
                      className="text-dark-light w-full mt-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Start date"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                    />
                    <p className="text-sm mt-3 font-bold">End date and time</p>
                    <input
                      type="datetime-local"
                      className="text-dark-light w-full mt-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="End date"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                    />

                    <p className="text-sm mt-3 font-bold">Event format</p>
                    <div className="flex items-center mt-1">
                      <input
                        type="radio"
                        id="offline"
                        name="event-type"
                        value="offline"
                        checked={eventFormat === "offline"}
                        onChange={(e) => setEventFormat(e.target.value)}
                      />
                      <label htmlFor="offline">Offline</label>
                      <input
                        type="radio"
                        id="online"
                        name="event-type"
                        value="online"
                        className="ml-4"
                        checked={eventFormat === "online"}
                        onChange={(e) => setEventFormat(e.target.value)}
                      />
                      <label htmlFor="online">Online</label>
                    </div>

                    <input
                      type="number"
                      className="text-dark-light w-full mt-4 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Max prize"
                      onChange={(e) => setEventPrize(e.target.value)}
                      value={eventPrize}
                    />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-dark-lightest focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleCloseModal}
                    >
                      Save event
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div
        className={`w-full mx-24 my-3 ${
          isMobile ? "ml-0 mx-0" : "ml-40 md:ml-48"
        }`}
      >
        <div className="flex w-full justify-center lg:justify-end items-center mt-8">
          <button
            className={`${
              userProfile && !userProfile.staff && "invisible"
            } bg-primary text-background font-semibold text-sm py-1 px-5 rounded-md shadow-buttonShadowHost hover:bg-accent-light`}
            onClick={() => setIsOpen(true)}
          >
            Host a Hackathon
          </button>
          <button
            disabled={true}
            className="bg-accent opacity-20 text-background font-semibold text-sm py-1 px-5 rounded-md shadow-buttonShadowJoin hover:bg-accent-light ml-4"
          >
            Join a hackathon
          </button>
        </div>
        <div className="ml-2 lg:ml-24 mt-8 3xl:mt-16">
          <h1 className="text-background text-3xl font-semibold">Ongoing</h1>
          <div className="w-full h-px bg-background mt-3 mx-auto"></div>
          <div className="eventcontainerscroll overflow-y-scroll h-64 w-full flex flex-col items-center justify-start pr-2">
            {events.map((event) => (
              <EventCard
                img={event.thumbnail}
                name={event.title}
                format={event.format}
                prize={event.prize}
                participants={"100"}
                startTime={event.start_time}
                endTime={event.end_time}
                isUpcoming={false}
                id={event.id}
              />
            ))}
            {events.length === 0 && (
              <p className="text-white text-xl font-semibold mt-4">
                No events yet
              </p>
            )}
          </div>
        </div>
        <div className="ml-2 lg:ml-24 mt-5">
          <h1 className="text-background text-3xl font-semibold">Upcoming</h1>
          <div className="w-full h-px bg-background mt-3 mx-auto"></div>

          <div className="eventcontainerscroll overflow-y-scroll h-64 w-full flex flex-col items-center justify-start pr-2">
            {upComingEvents.length === 0 && (
              <p className="text-white text-xl font-semibold mt-4">
                No events yet
              </p>
            )}
            {upComingEvents.map((event) => (
              <EventCard
                img={event.thumbnail}
                name={event.title}
                format={event.format}
                prize={event.prize}
                participants={"100"}
                startTime={event.start_time}
                endTime={event.end_time}
                isUpcoming={true}
                id={event.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
