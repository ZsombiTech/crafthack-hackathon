import { SET_USER_PROFILE } from "../actionTypes/actionTypes";

interface ActionType {
  type: string;
  payload: any;
}

const initialState = {
  userProfile: null,
};

export const UserReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    default:
      return state;
  }
};
