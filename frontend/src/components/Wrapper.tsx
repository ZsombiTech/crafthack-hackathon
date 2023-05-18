import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/user";
import { setUserProfile } from "../redux/actions/userAction";
import LoadingFullPage from "./LoadingFullPage";

export default function Wrapper({ className, children }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.userProfile);
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    if (!userProfile) {
      getUserProfile()
        .then((response) => {
          if (response.data.email) {
            dispatch(setUserProfile(response.data));
            isLoading(false);
          } else {
            dispatch(setUserProfile(null));
            if (
              location.pathname !== "/login" &&
              location.pathname !== "/register"
            )
              window.location.href = "/login";
            isLoading(false);
          }
        })
        .catch((error) => {
          dispatch(setUserProfile(null));
          if (
            location.pathname !== "/login" &&
            location.pathname !== "/register"
          )
            window.location.href = "/login";
          isLoading(false);
        });
    }
  }, [dispatch, location.pathname, navigate, userProfile]);
  return (
    <>
      {loading && <LoadingFullPage />}
      <div className={className}>{children}</div>
    </>
  );
}
