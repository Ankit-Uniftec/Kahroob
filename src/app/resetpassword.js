import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import InputField from '../components/InputField';
import ThemeConstant from '../constants/ThemeConstant';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
import axios from 'axios';
import API_Data from '../constants/API_Data';
import { showMessage } from 'react-native-flash-message';
import Routes from '../constants/Routes';

import useThemeConstants from '../hooks/useThemeConstants';
import { useSelector } from 'react-redux';

const ResetPassword = () => {
  const themeConstant = useThemeConstants();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPasseord] = useState('');
  const [confirmPassword, setConrimPassword] = useState('');
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const params = useLocalSearchParams();

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);

  const initialTranslateObj = {
    resetPassword: 'Reset Password',
    enterotpText: 'Please enter the 6 digit otp',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    setPassword: 'Set Password',
    password: 'Password',
    passwordError:
      'Password: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character',
    errorText: 'Error',
    successText: 'Success',
    allFiedsError: 'All fields are required',
    sixDigitOPTError: '6 digit OPT Required',
    strongPasswordError: 'Strong password required',
    passUnmatchError: 'Password nat match!',
    otpIncorrectError: 'OTP is incorrect',
    resetSuccessfullText: 'Password reset successfully',
    failToRestError: 'Failed to reset password',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
    if (params.email) {
      setEmail(params.email);
    }
  }, [selectedLanguage]);

  function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  const handleLogin = async () => {
    if (otp.trim() == '' || password.trim() == '' || confirmPassword.trim() == '') {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.allFiedsError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    if (otp.trim().length < 6) {
      setError({
        password: translateObj.sixDigitOPTError,
      });
      showMessage({
        message: translateObj.errorText,
        description: translateObj.sixDigitOPTError,
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

    if (password !== confirmPassword) {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.passUnmatchError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        API_Data.url + '/users/changePasswordWithOtp',
        {
          user: {
            email,
          },
          password: password,
          otp: otp,
        },
        {
          headers: { ...API_Data.getHeaders(null, selectedLanguage) },
        }
      );
      if (response.data && response.data.isSuccess && response.data.data) {
        showMessage({
          message: translateObj.successText,
          description: translateObj.resetSuccessfullText,
          type: 'success',
          duration: 3000,
        });
        setTimeout(() => {
          router.replace(`${Routes.LOGIN}`);
        }, 1000);
      } else {
        if (response.data.error == 'OTP_INVALID') {
          showMessage({
            message: translateObj.errorText,
            description: translateObj.otpIncorrectError,
            type: 'danger',
            duration: 3000,
          });
        } else {
          showMessage({
            message: translateObj.errorText,
            description: translateObj.failToRestError,
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.log('getting error in reset password ==>', error);
      showMessage({ message: 'Error', description: translateObj.failToRestError, type: 'danger', duration: 3000 });
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
      <BackButton marginBottom={52} />
      {isTranslatesLoaded ? (
        <>
          <Text style={styles.title}>{translateObj.resetPassword}</Text>
          <Text style={styles.subtitle}>{translateObj.enterotpText}.</Text>
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <InputField
              maxLength={6}
              placeholder='OTP'
              iconname={'mail'}
              value={otp}
              onChangeText={(text) => setOtp(text)}
              keyboardType='number-pad'
            />
          </View>
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <InputField
              placeholder={translateObj.newPassword}
              value={password}
              iconname={'lock'}
              onChangeText={(text) => setPasseord(text)}
              secureTextEntry
            />
          </View>

          <View
            style={{
              marginBottom: 40,
            }}
          >
            <InputField
              placeholder={translateObj.confirmPassword}
              value={confirmPassword}
              iconname={'lock'}
              onChangeText={(text) => setConrimPassword(text)}
              secureTextEntry
            />
            {error?.password && <Text style={{ color: 'red', fontSize: 13 }}>{error?.password}</Text>}
          </View>
          <CustomButton title={translateObj.setPassword} onPress={handleLogin} loading={isLoading} />
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
    marginBottom: 25,
  },
  subtitle: {
    color: ThemeConstant.FADED_BLACK,
    marginBottom: 25,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(22),
    paddingHorizontal: moderateScale(28),
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '100%',
    height: moderateVerticalScale(300),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modaltitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    marginVertical: 20,
  },
  check: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: 80,
    backgroundColor: ThemeConstant.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalsubtitle: {
    color: ThemeConstant.FADED_BLACK,
    textAlign: 'center',
    fontSize: 14,
  },
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

export default ResetPassword;
