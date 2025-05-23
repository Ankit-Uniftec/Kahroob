import React from "react";
import { Stack } from "expo-router";
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FlashMessage from "react-native-flash-message";
import Routes from "../constants/Routes";
import AppProvider from "../context";
import { Platform } from "react-native";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppProvider>
          <PersistGate loading={false} persistor={persistor}>
            <FlashMessage
              position="top"
              style={Platform.OS == "android" && { paddingTop: 28 }}
            />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name={Routes.HOME} />
              <Stack.Screen name={Routes.LOGIN} />
              <Stack.Screen name={Routes.SIGNUP} />
              <Stack.Screen name={Routes.OTP} />
              <Stack.Screen name={Routes.FORGOT_PASSWORD} />
              <Stack.Screen name={Routes.RESET_PASSWORD} />
              <Stack.Screen name={Routes.CONTACT_US} />
              <Stack.Screen name={Routes.TIPS_TRICKS} />
              <Stack.Screen name={Routes.TIPS_TRICKS_DETAIL} />
              <Stack.Screen name={Routes.NOTIFICATION} />

              <Stack.Screen name={Routes.ONBOADRIND_LANGUAGE} />
              <Stack.Screen name={Routes.ONBOADRIND1} />
              <Stack.Screen name={Routes.ONBOADRIND2} />
              <Stack.Screen name={Routes.ONBOADRIND3} />
              <Stack.Screen name={Routes.ONBOADRIND4} />

              <Stack.Screen name={Routes.UPLOAD_AD} />
              {/* <Stack.Screen name={Routes.ABOUT_US} /> */}
              {/* <Stack.Screen name={Routes.SETTINGS} /> */}

              {/* Profiles Screens */}
              <Stack.Screen name={Routes.EDIT_PROFILE} />
              <Stack.Screen name={Routes.MY_VEHICLES} />
              <Stack.Screen name={Routes.MY_REVIEWS} />
              <Stack.Screen name={Routes.LANGUAGES} />
              <Stack.Screen name={Routes.ADD_EV_STATIONS} />
              <Stack.Screen name={Routes.ADD_ADVERTISEMENT} />
              <Stack.Screen name={Routes.ADD_ITEM} />
              <Stack.Screen name={Routes.ADD_CLLASSIFIED} />

              <Stack.Screen
                name={Routes.TABS}
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </PersistGate>
        </AppProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
