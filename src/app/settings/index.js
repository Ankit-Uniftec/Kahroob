import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { EvilIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import API_Data from '../../constants/API_Data';
import axios from 'axios';
import Routes from '../../constants/Routes';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT, SET_NOTIFICATION } from '../../store/allactionsTypes';
import Header from '../../components/Header';
import useThemeConstants from '../../hooks/useThemeConstants';
import ThemeConstant from '../../constants/ThemeConstant';

const Settings = () => {
  const dispatch = useDispatch();

  const themeConstant = useThemeConstants();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const { isNotification } = useSelector((state) => state.AuthReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    settingsText: 'Settings',
    notificationsText: 'Notifications',
    changePasswordText: 'Change Password',
    deleteAccountText: 'Delete Account',
    saveChangesText: 'Save Changes',
  };
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

  const handleDelete = async () => {
    let response = await axios.put(
      API_Data.url + 'users/' + user.id,
      {
        status: 'inactive',
      },
      {
        headers: { ...API_Data.getHeaders(user, selectedLanguage) },
      }
    );
    console.log(JSON.stringify(response.data));
    if (response.data && response.data.isSuccess) {
      await SecureStore.deleteItemAsync('user');
      dispatch({ type: LOGOUT });
      setTimeout(() => {
        router.replace(`${Routes.LOGIN}`);
      });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.settingsText} />

          <View style={{ paddingHorizontal: ThemeConstant.PADDING_MAIN, marginTop: 10, gap: 20 }}>
            {/* Notifications */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14), fontWeight: '700' }}>
                {translateObj.notificationsText}
              </Text>
              <Switch
                trackColor={{ false: '#d3d3d3', true: '#00CC44' }}
                thumbColor={'#fff'}
                ios_backgroundColor='#fff'
                onValueChange={() => {
                  dispatch({ type: SET_NOTIFICATION, payload: isNotification ? false : true });
                }}
                value={isNotification}
              />
            </TouchableOpacity>
            <View style={styles.line} />

            {/* Change Password */}
            <TouchableOpacity
              onPress={() => router.push(Routes.CHANGE_PASSWORD)}
              activeOpacity={0.8}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14), fontWeight: '700' }}>
                {translateObj.changePasswordText}
              </Text>
              <Image
                source={require('../../../assets/back-icon.png')}
                resizeMode='contain'
                style={[styles.backIcon, { tintColor: themeConstant.TEXT_PRIMARY }]}
              />
            </TouchableOpacity>
            <View style={styles.line} />

            {/* Delete Account */}
            <TouchableOpacity
              onPress={() => handleDelete()}
              activeOpacity={0.8}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14), fontWeight: '700' }}>
                {translateObj.deleteAccountText}
              </Text>
              <EvilIcons name='trash' size={24} color='red' />
            </TouchableOpacity>
            <View style={styles.line} />
          </View>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  line: {
    borderBottomWidth: 0.6,
    borderColor: '#96A7AF',
  },
  icon: {
    width: 30,
    height: 30,
  },
  backIcon: {
    width: scale(16),
    height: scale(16),
    transform: [{ rotate: '180deg' }],
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
