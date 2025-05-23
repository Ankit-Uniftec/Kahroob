import {
  EV_STATIONS,
  SET_RADIUS,
  SET_LANGUAGE,
  HOME_ROUTE,
  KEYBOARD_OPEN,
  SET_CONNECTORS,
  SET_NETWORKS,
  SET_CHARGING_SPEED,
  SET_AVAILABLE_NOW,
  TENANT,
} from '../allactionsTypes';

const initialState = {
  evStations: [],
  radius: 50000.0,
  selectedLanguage: 'ar',
};

export default function AppReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case TENANT:
      return {
        ...state,
        tenant: payload,
      };
    case EV_STATIONS:
      return {
        ...state,
        evStations: payload,
      };
    case SET_RADIUS:
      return {
        ...state,
        radius: payload,
      };
    case SET_CONNECTORS:
      return {
        ...state,
        selectedChargingTypes: payload,
      };
    case SET_AVAILABLE_NOW:
      return {
        ...state,
        isAvailableNow: payload,
      };
    case SET_NETWORKS:
      return {
        ...state,
        selectedNetworks: payload,
      };
    case SET_CHARGING_SPEED:
      return {
        ...state,
        selectedCharginSpeed: payload,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        selectedLanguage: payload,
      };
    case HOME_ROUTE:
      return {
        ...state,
        homeRoute: payload,
      };
    case KEYBOARD_OPEN:
      return {
        ...state,
        isKeyboardOpen: payload,
      };
    default:
      return {
        ...state,
      };
  }
}
