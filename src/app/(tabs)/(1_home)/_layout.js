import React from 'react';
import { Stack } from 'expo-router';

import Routes from '../../../constants/Routes';
import { HOME_ROUTE } from '../../../store/allactionsTypes';
import { useDispatch } from 'react-redux';

const Layout = () => {
  const dispatch = useDispatch();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      screenListeners={{
        focus: (e) => {
          if (e.target.includes(Routes.HOME_INDEX)) {
            dispatch({ type: HOME_ROUTE, payload: 'show' });
          } else {
            dispatch({ type: HOME_ROUTE, payload: 'hide' });
          }
        },
      }}
    >
      {/* <Stack.Screen name={Routes.HOME_INDEX} />
      <Stack.Screen name={Routes.HOME_STATION_DETAIL} />
      <Stack.Screen name={Routes.HOME_MAP_FILTER} />
      <Stack.Screen name={Routes.HOME_MAP_LIST} /> */}
    </Stack>
  );
};

export default Layout;
