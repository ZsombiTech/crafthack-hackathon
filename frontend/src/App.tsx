import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Error from "./routes/Error";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <div className="invisible">
          <Navbar />
        </div>
        <Login />
      </>
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
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
