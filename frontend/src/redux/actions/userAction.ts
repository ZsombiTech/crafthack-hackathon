import { SET_USER_PROFILE, SET_HACKATHON } from "../actionTypes/actionTypes";

const setUserProfile = (payload: any) => {
  return {
    type: SET_USER_PROFILE,
    payload,
  };
};

const setHackathon = (payload: any) => {
  return {
    type: SET_HACKATHON,
    payload,
  };
};

export { setUserProfile, setHackathon };
