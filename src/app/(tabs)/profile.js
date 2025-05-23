import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../constants/ThemeConstant';
import Profileitem from '../../components/profile/profileitem';
import Line from '../../components/profile/line';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { SET_THEME, LOGOUT } from '../../store/allactionsTypes';
import { router } from 'expo-router';
import Routes from '../../constants/Routes';
import * as ImagePicker from 'expo-image-picker';
import useThemeConstants from '../../hooks/useThemeConstants';
import * as SecureStore from 'expo-secure-store';
import API_Data from '../../constants/API_Data';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { isDark } = useSelector((state) => state.ThemeReducer);
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const themeConstant = useThemeConstants();

  const [image, setImage] = useState(user?.pic);
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    myProfileText: 'My Profile',
    personalInfoText: 'Personal Info',
    reviewsText: 'Reviews',
    languageText: 'Language',
    newChargingStationText: 'Add New Charging Station',
    newClassifiedText: 'Add New Classified',
    contactUsText: 'Contact Us',
    settingsText: 'Settings',
    darkModeText: 'Dark Mode',
    logOutText: 'Logout',
    aboutUsText: 'About Us',
    advertiseWithUsText: 'Advertise With Us',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
  }, [selectedLanguage]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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

  const handleLogout = async () => {
    await axios.get(API_Data.url + 'users/logout', {
      headers: { ...API_Data.getHeaders(user, selectedLanguage) },
    });
    await SecureStore.deleteItemAsync('user');
    dispatch({ type: LOGOUT });
    setTimeout(() => {
      router.replace(`${Routes.LOGIN}`);
    });
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              paddingHorizontal: ThemeConstant.PADDING_MAIN,
              height: moderateVerticalScale(218),
            }}
          >
            <Text style={styles.title}>{translateObj.myProfileText}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
              <View style={styles.imageContainer}>
                <Image source={image ? { uri: image } : require('../../../assets/avatar.png')} style={styles.profileImage} />
                <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
                  <SimpleLineIcons name='pencil' size={12} color='#fff' />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.number}>
                  {user?.countryCode ? `(${user?.countryCode})` : null} {user?.phone}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                paddingHorizontal: ThemeConstant.PADDING_MAIN,
                gap: scale(17),
                marginTop: moderateScale(30),
              }}
            >
              <Profileitem name={translateObj.personalInfoText} onClick={() => router.push(Routes.EDIT_PROFILE)} />
              <Line />
              <Profileitem name={translateObj.reviewsText} onClick={() => router.push(Routes.MY_REVIEWS)} />
              {/* <Profileitem name={'Notifications'} onClick={() => router.push(Routes.NOTIFICATION)} /> */}
              {/* <Profileitem name={'My Vehicles'} onClick={() => router.push(Routes.MY_VEHICLES)} /> */}
              {/* <Profileitem name={'Subscription'} /> */}
              <Profileitem name={translateObj.languageText} onClick={() => router.push(Routes.LANGUAGES)} />
              <Line />
              <Profileitem name={translateObj.newChargingStationText} onClick={() => router.push(Routes.ADD_EV_STATIONS)} />
              <Profileitem name={translateObj.newClassifiedText} onClick={() => router.push(Routes.ADD_CLLASSIFIED)} />
              <Profileitem name={translateObj.advertiseWithUsText} onClick={() => router.push(Routes.ADD_ADVERTISEMENT)} />
              <Line />
              <Profileitem name="Buy me a Coffee" onClick={() => router.push('https://www.buymeacoffee.com')} />
              <Profileitem name="Kickstarter" onClick={() => router.push('https://www.kickstarter.com')} />
              <Line />
              {/* <Profileitem name={'Blogs'} /> */}
              <Profileitem name={translateObj.contactUsText} onClick={() => router.push(Routes.CONTACT_US)} />
              <Profileitem name={translateObj.aboutUsText} onClick={() => router.push(Routes.ABOUT_US)} />
              <Profileitem name={translateObj.settingsText} onClick={() => router.push(Routes.SETTINGS)} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: scale(16),
                    color: themeConstant.TEXT_PRIMARY,
                  }}
                >
                  {translateObj.darkModeText}
                </Text>

                <View>
                  <Switch
                    trackColor={{ false: '#d3d3d3', true: '#3e3e3e' }}
                    thumbColor={'#fff'}
                    ios_backgroundColor='#fff'
                    onValueChange={() => {
                      dispatch({ type: SET_THEME, payload: isDark ? false : true });
                    }}
                    value={isDark}
                  />
                </View>
              </View>
              <Line />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#ff0000',
                    fontWeight: '600',
                    fontSize: scale(16),
                  }}
                >
                  {translateObj.logOutText}
                </Text>

                <TouchableOpacity onPress={handleLogout}>
                  <MaterialIcons name='logout' size={24} color='#ff0000' />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 24,
  },

  imageContainer: {
    backgroundColor: '#fff',
    position: 'relative',
    borderRadius: scale(50),
    padding: scale(2),
    width: moderateScale(80),
    aspectRatio: 1 / 1,
    borderWidth: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(50),
    resizeMode: 'cover',
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: moderateScale(24),
    aspectRatio: 1 / 1,
    backgroundColor: ThemeConstant.PRIMARY_COLOR,
    borderRadius: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontWeight: '700',
    fontSize: scale(20),
    marginVertical: moderateVerticalScale(30),
  },
  name: {
    fontWeight: '700',
    fontSize: scale(20),
    color: '#0E1617',
    marginBottom: moderateScale(8),
  },
  number: {
    color: '#0E1617',
    fontSize: moderateScale(14),
  },
  email: {
    color: ThemeConstant.FADED_BLACK,
    fontSize: moderateScale(14),
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
