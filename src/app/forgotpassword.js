import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import InputField from '../components/InputField';
import ThemeConstant from '../constants/ThemeConstant';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';
import Routes from '../constants/Routes';
import { handleAuthErrors } from '../utils/authError';
import axios from 'axios';
import API_Data from '../constants/API_Data';

import useThemeConstants from '../hooks/useThemeConstants';
import { useSelector } from 'react-redux';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const themeConstant = useThemeConstants();
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);

  const initialTranslateObj = {
    forgotpassword: 'Forgot Password',
    forgotpasswordText: 'Please enter your registered email. We will send an OTP to reset your password.',
    email: 'E-mail',
    sendOtp: 'Send OTP',
    resend: 'Resend',
    invalidCredantialsError: 'Invalid Credantials',
    wrongPassword: 'Wrong password',
    useSocialLoginError: 'Please use social login',
    userDisabled: 'User disabled',
    emailRequiredError: 'Email is required',
    invalidEmailError: 'Not a valid email',
    errorText: 'Error',
    successText: 'Success',
    otpSentText: 'OTP Sent',
  }
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
  }, [selectedLanguage]);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleLogin = async () => {
    if (email.trim() == '') {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.emailRequiredError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    const res = isValidEmail(email.trim());
    if (!res) {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.invalidEmailError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('send otp initialized');
      const response = await axios.post(
        API_Data.url + '/users/sendOtp',
        {
          email: email,
        },
        {
          headers: { ...API_Data.getHeaders(null, selectedLanguage) },
        }
      );
      if (response.data && response.data.isSuccess && response.data.data) {
        showMessage({
          message: translateObj.successText,
          description: translateObj.otpSentText,
          type: 'success',
          duration: 3000,
        });
        setTimeout(() => {
          router.push({
            pathname: Routes.RESET_PASSWORD,
            params: { email: email },
          });
        }, 500);
      } else {
        console.log('send otp failed ==>', response.data.error);
        handleAuthErrors({ code: response.data.error }, translateObj);
      }
    } catch (error) {
      console.log('send otp failed ==>', error);
      handleAuthErrors(error, translateObj);
    } finally {
      setIsLoading(false);
    }
  };

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
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

  return (
    <SafeAreaView style={styles.container}>
      {isTranslatesLoaded ? (
        <>
          <BackButton marginBottom={52} />

          <Text style={styles.title}>{translateObj.forgotpassword}?</Text>
          <Text style={styles.subtitle}>{translateObj.forgotpasswordText}</Text>
          <View
            style={{
              marginBottom: 52,
            }}
          >
            <InputField
              placeholder={translateObj.email}
              value={email}
              iconname={'mail'}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <CustomButton title={translateObj.sendOtp} onPress={handleLogin} loading={isLoading} />
          <Text style={styles.forgotpasswordText}>{translateObj.resend}</Text>
        </>
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 52,
  },
  subtitle: {
    color: ThemeConstant.FADED_BLACK,
    marginBottom: 52,
  },
  forgotpasswordText: {
    color: ThemeConstant.PRIMARY_COLOR,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  or: {
    color: ThemeConstant.FADED_BLACK,
    textAlign: 'center',
    margin: 8,
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

export default ForgotPassword;
