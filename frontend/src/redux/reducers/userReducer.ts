import { SET_USER_PROFILE, SET_HACKATHON } from "../actionTypes/actionTypes";

interface ActionType {
  type: string;
  payload: any;
}

const initialState = {
  userProfile: null,
  hackathon: null,
};

export const UserReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case SET_HACKATHON:
      return {
        ...state,
        hackathon: action.payload,
      };

    default:
      return state;
  }
};
