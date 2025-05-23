import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import BackButton from '../../components/BackButton';
import { router } from 'expo-router';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import Routes from '../../constants/Routes';
import { LOGOUT } from '../../store/allactionsTypes';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import API_Data from '../../constants/API_Data';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj ={
    currentPassText: 'Current Password',
    enterNewPassText: 'Enter New Password',
    changePasswordText: 'Change Password',
    confirmNewPassText: 'Confirm New Password',
    errorText: 'Error',
    allFieldReqiredText: 'All fields are required!',
    currentPassErrorText:
      'Current Password: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character',
    currentPassStrongText: 'Current Password: Strong password required',
    passMatchText: 'Password nat match!',
    newPassErrorText:
      'New Password: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character',
    newPassStrongText: 'New Password: Strong password required',
    successText: 'Success',
    passUpdateText: 'Password updated successfully',
    currentPassIncorrect: 'Current password is incorrect',
    failUpdateText: 'Failed to update password',
  }
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
  }, [selectedLanguage]);

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
      if (response.data && response.data.isSuccess && response.data.data) {
        let newTranslationObj = response.data.data;
        setTranslateObj(newTranslationObj);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.allFieldReqiredText,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    const checkPassword = isStrongPassword(oldPassword);
    if (!checkPassword) {
      setError({
        password: translateObj.currentPassErrorText,
      });
      showMessage({
        message: translateObj.errorText,
        description: translateObj.currentPassStrongText,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.passMatchText,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    const checkPasswordNew = isStrongPassword(newPassword);
    if (!checkPasswordNew) {
      setError({
        password: translateObj.newPassErrorText,
      });
      showMessage({
        message: translateObj.errorText,
        description: translateObj.newPassStrongText,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        API_Data.url + '/users/changePassword',
        {
          user: 'my',
          password: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: { ...API_Data.getHeaders(user, selectedLanguage) },
        }
      );
      if (response.data && response.data.isSuccess && response.data.data) {
        showMessage({
          message: translateObj.successText,
          description: translateObj.passUpdateText,
          type: 'success',
          duration: 3000,
        });
        await SecureStore.deleteItemAsync('user');
        setTimeout(() => {
          dispatch({ type: LOGOUT });
          router.replace(`${Routes.LOGIN}`);
        }, 1000);
      } else {
        if (response.data.error == 'PASSWORD_INVALID') {
          showMessage({
            message: translateObj.errorText,
            description: translateObj.currentPassIncorrect,
            type: 'danger',
            duration: 3000,
          });
        } else {
          showMessage({
            message: translateObj.errorText,
            description: translateObj.failUpdateText,
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.log('getting error in updating password ==>', error);
      showMessage({
        message: translateObj.errorText,
        description: translateObj.failUpdateText,
        type: 'danger',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), paddingVertical: 14 }}>
            <BackButton />
            <Text style={{ fontWeight: '600', fontSize: scale(20) }}>{translateObj.changePasswordText}</Text>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
            <View style={styles.inputContainer}>
              <View>
                <InputField
                  placeholder={translateObj.currentPassText}
                  value={oldPassword}
                  onChangeText={(text) => setOldPassword(text)}
                  secureTextEntry
                />
                {/* <Text style={styles.forgotpasswordText}>Forgot Password?</Text> */}
              </View>

              <InputField
                placeholder={translateObj.enterNewPassText}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                secureTextEntry
              />

              <InputField
                placeholder={translateObj.confirmNewPassText}
                value={confirmPassword}
                secureTextEntry
                onChangeText={(text) => setConfirmPassword(text)}
              />
            </View>

            <View style={{ flex: 1 }} />

            <CustomButton title={translateObj.changePasswordText} onPress={handleSubmit} loading={isLoading} />
          </ScrollView>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    paddingHorizontal: ThemeConstant.PADDING_MAIN,
  },
  inputContainer: {
    marginTop: moderateVerticalScale(40),
    gap: 22,
  },
  forgotpasswordText: {
    color: ThemeConstant.FADED_BLACK,
    textAlign: 'right',
    paddingVertical: 10,
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
