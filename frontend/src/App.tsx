import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Error from "./routes/Error";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./routes/Home";
import Sidebar from "./components/Sidebar";
import Attendees from "./routes/Attendees";
import Settings from "./routes/Settings";
import Dashboard from "./routes/Dashboard";
import MobileSidebar from "./components/MobileSidebar";
import Chat from "./routes/Chat";
import Tinder from "./routes/Tinder";
import Wrapper from "./components/Wrapper";
import Motivation from "./routes/Motivation";
import LastMinute from "./routes/LastMinute";

const isMobile = window.innerWidth < 1270;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Home />
      </Wrapper>
    ),
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: (
      <>
        <div className="invisible">
          <Navbar />
        </div>
        <Login />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <div className="invisible">
          <Navbar />
        </div>
        <Register />
      </>
    ),
  },
  {
    path: "/attendees",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Attendees />
      </Wrapper>
    ),
  },
  {
    path: "/settings",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Settings />
      </Wrapper>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Dashboard />
      </Wrapper>
    ),
  },
  {
    path: "/chat",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Chat />
      </Wrapper>
    ),
  },
  {
    path: "/tinder",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Tinder />
      </Wrapper>
    ),
  },
  {
    path: "/motivation",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Motivation />
      </Wrapper>
    ),
  },
  {
    path: "/lastMinute",
    element: (
      <Wrapper className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <LastMinute />
      </Wrapper>
    ),
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
