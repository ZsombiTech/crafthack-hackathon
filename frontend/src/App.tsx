import React, { useEffect } from "react";
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

const isMobile = window.innerWidth < 1270;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Home />
      </div>
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
      <div className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Attendees />
      </div>
    ),
  },
  {
    path: "/settings",
    element: (
      <div className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Settings />
      </div>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <div className="flex">
        {!isMobile ? <Sidebar /> : <MobileSidebar />}
        <Dashboard />
      </div>
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
