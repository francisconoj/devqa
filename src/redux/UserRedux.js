/**
 * Created by InspireUI on 14/02/2017.
 *
 * @format
 */
import CustomAPI from "@services/CustomAPI";
import { WooWorker } from "api-ecommerce";
const types = {
  LOGOUT: "LOGOUT",
  LOGIN: "LOGIN_SUCCESS",
  FINISH_INTRO: "FINISH_INTRO",
  UPDATE_PROFILE: "UPDATE_PROFILE",
};

export const actions = {
  login: (user, token) => {
    return { type: types.LOGIN, user, token };
  },
  logout() {
    return { type: types.LOGOUT };
  },
  finishIntro() {
    return { type: types.FINISH_INTRO };
  },
  updateProfile: (dispatch, profile) => {
    dispatch({ type: types.UPDATE_PROFILE, profile });
  },
};

const initialState = {
  user: null,
  token: null,
  finishIntro: true,
};

export const reducer = (state = initialState, action) => {
  const { type, user, token, profile } = action;

  switch (type) {
    case types.LOGOUT:
      return Object.assign({}, initialState);
    case types.LOGIN:
      return { ...state, user, token, profile: user };
    case types.FINISH_INTRO:
      return { ...state, finishIntro: true };
    case types.UPDATE_PROFILE:
      const profile = {
        first_name: action.profile.first_name,
        last_name: action.profile.last_name,
        user_id: action.profile.user_id,
      };



      const newUser = state.user;
      newUser.first_name = action.profile.first_name
      newUser.last_name = action.profile.last_name

      CustomAPI.updateProfile({ profile }, (profile) => {

      });
      return {
        ...state, //copying the orignal state
        user: newUser, //reassingning todos to new array
      }
    default:
      return state;
  }
};
