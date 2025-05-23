import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { moderateVerticalScale, scale } from 'react-native-size-matters';

import { handleAuthErrors } from '../utils/authError';

import InputField from '../components/InputField';
import ThemeConstant from '../constants/ThemeConstant';
import CustomButton from '../components/CustomButton';
import Routes from '../constants/Routes';
import API_Data from '../constants/API_Data';
import { LOGIN_SUCCESS } from '../store/allactionsTypes';
import GoogleLogo from '../../assets/social/google.png';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { SET_LANGUAGE } from '../store/allactionsTypes';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import useThemeConstants from '../hooks/useThemeConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const GoogleLogin = async () => {
//   await GoogleSignin.hasPlayServices();
//   const userInfo = await GoogleSignin.signIn();
//   return userInfo;
// };

const LoginScreen = () => {
  const themeConstant = useThemeConstants();
  const dispatch = useDispatch();
  // const { selectedLanguage } = useSelector((state) => state.AppReducer);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);

  const initialTranslateObj = {
    welcomeText: 'Welcome Back',
    loginText: 'Please Login to Continue',
    emailPlaceholder: 'E-mail',
    passwordPlaceholder: 'Password',
    forgotPassword: 'Forgot Password',
    continueText: 'or continue with',
    login: 'Login',
    passwordError: 'Password must be at least 8 characters and must match the one provided during signup.',
    dontHaveAccoutText: `Don't have an account`,
    notValidEmailError: 'Not a valid email',
    signUp: 'Sign up',
    errorText: 'Error',
    successText: 'Success',
    bothFieldsError: 'Both fields are required',
    strongPasswordError: 'Strong password required',
    successfullLogin: 'Successfull Logged in!',
    invalidCredantialsError: 'Invalid Credantials',
    wrongPassword: 'Wrong password',
    useSocialLoginError: 'Please use social login',
    userDisabled: 'User disabled',
    somethingWrongError: 'Something went wrong',
  }
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // function isStrongPassword(password) {
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   return passwordRegex.test(password);
  // }

  function isStrongPassword(password) {
    return password.length >= 8;
  }

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.bothFieldsError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    const res = isValidEmail(email.trim());
    if (!res) {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.notValidEmailError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    const checkPassword = isStrongPassword(password);
    if (!checkPassword) {
      setError({
        password: translateObj.passwordError,
      });
      showMessage({
        message: translateObj.errorText,
        description: translateObj.strongPasswordError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('login initialized');
      const response = await axios.post(
        `${API_Data.url}/users/login`,
        { email: email, password: password },
        { headers: { ...API_Data.getHeaders(null, selectedLanguage) } }
      );

      if (response.data && response.data.isSuccess) {
        dispatch({ type: LOGIN_SUCCESS, payload: { user: response.data.data } });
        await SecureStore.setItemAsync('user', JSON.stringify(response.data.data));
        showMessage({
          message: translateObj.successText,
          description: translateObj.successfullLogin,
          type: 'success',
          duration: 3000,
        });
        router.replace(`${Routes.TABS}`);
      } else {
        console.error('Login failed:', response.data.error);
        handleAuthErrors({ code: response.data.error }, translateObj);
      }
    } catch (error) {
      console.error('Login error:', error);
      handleAuthErrors(error, translateObj);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    alert("Google Login not implemented yet please use email login!");
    try {
      setIsLoading(true);
      console.log('googlelogin');
      const response = await GoogleLogin();
      const { idToken } = response;
      console.log(idToken);
      console.log('login initialized');
      const verifyResponse = await axios.post(
        API_Data.url + '/users/verify',
        {
          token: idToken,
          provider: 'google',
          type: 'login',
        },
        {
          headers: { ...API_Data.getHeaders(null, selectedLanguage) },
        }
      );
      console.log(JSON.stringify(verifyResponse.data));
      if (verifyResponse.data && verifyResponse.data.isSuccess && verifyResponse.data.data) {
        dispatch({ type: LOGIN_SUCCESS, payload: { user: verifyResponse.data.data } });
        await SecureStore.setItemAsync('user', JSON.stringify(verifyResponse.data.data));
        showMessage({
          message: translateObj.successText,
          description: translateObj.successText,
          type: 'success',
          duration: 3000,
        });
        setTimeout(() => {
          router.replace(`${Routes.TABS}`);
        }, 1500);
      } else {
        console.log('login failed ==>', verifyResponse.data.error);
        handleAuthErrors({ code: verifyResponse.data.error }, translateObj);
      }
    } catch (apiError) {
      console.log('login failed ==>', apiError);
      handleAuthErrors(apiError, translateObj);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithPhone = () => {
    // Implement your sign-up logic here
    console.log('Sign Up button pressed');
  };

  const handleSignup = () => {
    router.push(`${Routes.SIGNUP}`);
  };

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
      setIsTranslatesLoaded(true);
      return;
    }
    if (selectedLanguage == 'en') {
      setIsTranslatesLoaded(true);
      return;
    }
    try {
      const response = await axios.post(API_Data.url + '/translate', {
        data: translateObj,
        output: selectedLanguage,
      });
      console.log(JSON.stringify(response.data));
      if (response.data && response.data.isSuccess && response.data.data) {
        let newTranslationObj = response.data.data;
        setTranslateObj(newTranslationObj);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  useEffect(() => {
    getTranslatedData();
    // console.log("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);



  useEffect(() => {
    getLocalStorageItem();
  }, [])

  const getLocalStorageItem = async () => {
    const language = await AsyncStorage.getItem('SET_LANGUAGE') || 'en';
    setSelectedLanguage(language);
    dispatch({ type: SET_LANGUAGE, payload: language });
    await AsyncStorage.setItem('SET_LANGUAGE', language);
  };

  console.log("isTranslatesLoaded", isTranslatesLoaded)
  return (
    <SafeAreaView style={styles.container}>
      {isTranslatesLoaded ? (
        <ScrollView
          keyboardShouldPersistTaps='never'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, flexGrow: 1 }}
        >
          <Text style={styles.title}>{translateObj.welcomeText},</Text>
          <Text style={styles.subtitle}>{translateObj.loginText}!</Text>

          <View style={styles.inputContainer}>
            <InputField
              placeholder={translateObj.emailPlaceholder}
              value={email}
              iconname={'user'}
              onChangeText={(text) => setEmail(text)}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <InputField
              placeholder={translateObj.passwordPlaceholder}
              value={password}
              iconname={'lock'}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            {error?.password && <Text style={{ color: 'red', fontSize: 13 }}>{translateObj.passwordError}</Text>}
          </View>
          <Text onPress={() => router.push('./forgotpassword')} style={styles.forgotpasswordText}>
            {translateObj.forgotPassword}?
          </Text>
          <CustomButton title={translateObj.login} onPress={handleLogin} loading={isLoading} />

          <Text style={styles.or}>{translateObj.continueText}</Text>
          <View style={styles.pngHolderMain}>
            <TouchableOpacity onPress={() => handleGoogleLogin()} style={styles.pngButton}>
              <Image style={styles.png} source={GoogleLogo} />
            </TouchableOpacity>
          </View>

          {/* <Text style={styles.or}>or</Text> */}
          {/* <CustomButton type='outline' title="Login with Phone no." onPress={handleLoginWithPhone} /> */}
          <View style={{ flex: 1 }} />

          {/* Don't have an account */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 14,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                margin: 0,
                padding: 0,
                padding: 5,
              }}
            >
              <Text>{translateObj.dontHaveAccoutText}?</Text>
            </View>

            <TouchableOpacity
              onPress={handleSignup}
              style={{
                margin: 0,
                padding: 0,
                paddingVertical: 5,
                borderBottomWidth: 2,
                borderBottomColor: ThemeConstant.PRIMARY_COLOR,
              }}
            >
              <Text style={styles.signup}>{translateObj.signUp}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ThemeConstant.PADDING_MAIN,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: '700',
    fontSize: scale(32),
    marginBottom: moderateVerticalScale(12),
  },
  subtitle: {
    fontSize: scale(16),
    color: ThemeConstant.FADED_BLACK,
  },

  inputContainer: {
    marginTop: moderateVerticalScale(40),
    gap: 22,
  },

  forgotpasswordText: {
    color: ThemeConstant.FADED_BLACK,
    textAlign: 'right',
    paddingVertical: 10,
    marginBottom: 40,
  },
  or: {
    fontSize: scale(14),
    color: ThemeConstant.FADED_BLACK,
    textAlign: 'center',
    marginVertical: 12,
  },
  pngHolderMain: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pngButton: {
    height: 60,
    width: 90,
    backgroundColor: '#F0F5F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  signup: {
    fontWeight: 'bold',
  },
  signupbox: {},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loaderHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default LoginScreen;
