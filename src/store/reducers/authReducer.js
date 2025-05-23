import {
  LOGIN_SUCCESS,
  LOGOUT,
  REMOVE_FAVORITE,
  SET_FAVORITES,
  SET_NOTIFICATION,
  UPDATE_COUNTRY,
  UPDATE_FAVORITE,
  UPDATE_USER_DETAILS,
} from '../allactionsTypes';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isNotification: true,
  allFavorites: [],
  country: '',
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload.user,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case UPDATE_USER_DETAILS:
      return {
        ...state,
        user: payload,
      };
    case SET_NOTIFICATION:
      return {
        ...state,
        isNotification: payload,
      };
    case SET_FAVORITES:
      return {
        ...state,
        allFavorites: payload,
      };
    case UPDATE_FAVORITE:
      return {
        ...state,
        allFavorites: [payload, ...state.allFavorites],
      };
    case REMOVE_FAVORITE:
      let findIndex = state.allFavorites.findIndex(
        (f) => f.userId == payload.userId && f.displayName?.text === payload.name
      );
      if (findIndex !== -1) {
        let updatedFavorites = [...state.allFavorites];
        updatedFavorites.splice(findIndex, 1);
        return {
          ...state,
          allFavorites: updatedFavorites,
        };
      } else {
        return state;
      }
    case UPDATE_COUNTRY:
      return {
        ...state,
        country: payload,
      };
    default:
      return {
        ...state,
      };
  }
}
