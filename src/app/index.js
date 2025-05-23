import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Routes from "../constants/Routes";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_SUCCESS, SET_LANGUAGE, TENANT } from "../store/allactionsTypes";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from "axios";
import API_Data from "../constants/API_Data";

const Page = () => {
  const isAuthenticated = useSelector(
    (state) => state.AuthReducer.isAuthenticated
  );

  const [isFirstTime, setIsFirstTime] = useState(null);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const dispatch = useDispatch();

  // GoogleSignin.configure({
  //   webClientId: '280362042151-2uvtv65j9cco9v3f0imjk3hl4d74g8am.apps.googleusercontent.com',
  //   scopes: ['profile', 'email'],
  // });
  // console.log('isAuthenticated');

  useEffect(() => {
    getAuth();
    AsyncStorage.getItem("firstTime").then((value) => {
      setIsFirstTime(value === null);
    });
    AsyncStorage.getItem("SET_LANGUAGE").then((value) => {
      if (value) {
        dispatch({ type: SET_LANGUAGE, payload: value });
      }
    });
    axios
      .get(API_Data.url + "/tenants/ev")
      .then((response) => {
        if (response.data && response.data.isSuccess && response.data.data) {
          dispatch({ type: TENANT, payload: response.data.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getAuth = async () => {
    if (!isAuthenticated) {
      const user = await SecureStore.getItemAsync("user");
      if (user && JSON.parse(user)) {
        console.log("User Found in SecureStore");
        dispatch({ type: LOGIN_SUCCESS, payload: { user: JSON.parse(user) } });
        setIsAuthenticatedUser(true);
      }
    } else {
      setIsAuthenticatedUser(true);
    }
  };

  if (isFirstTime === null) {
    // Still determining if it's the first time
    return null; // Or a loading indicator
  }
  if (isFirstTime) {
    // Show onboarding screen
    return <Redirect href={Routes.ONBOADRIND_LANGUAGE} />;
  }

  if (!isAuthenticatedUser) {
    // Show login screen
    return <Redirect href={Routes.LOGIN} />;
  }

  return <Redirect href={Routes.TABS} />;
};
export default Page;
