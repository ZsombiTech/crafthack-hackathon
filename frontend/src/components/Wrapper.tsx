import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/user";
import { setUserProfile } from "../redux/actions/userAction";
import LoadingFullPage from "./LoadingFullPage";

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

export function deleteCookie(name: string) {
  setCookie(name, "", null, null, null, 1);
}

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
          if (response?.data.email) {
            dispatch(setUserProfile(response?.data));
            isLoading(false);
          } else {
            dispatch(setUserProfile(null));
            if (
              location.pathname !== "/login" &&
              location.pathname !== "/register"
            ) {
              navigate("/");
            }
            isLoading(false);
          }
        })
        .catch((error) => {
          dispatch(setUserProfile(null));
          if (
            location.pathname !== "/login" &&
            location.pathname !== "/register"
          ) {
            navigate("/");
          }
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
