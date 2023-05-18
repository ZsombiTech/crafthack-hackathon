import { SET_USER_PROFILE } from "../actionTypes/actionTypes";

const setUserProfile = (payload: any) => {
  return {
    type: SET_USER_PROFILE,
    payload,
  };
};

export { setUserProfile };
