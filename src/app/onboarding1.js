import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';

import ThemeConstant from '../constants/ThemeConstant';
import Routes from '../constants/Routes';
import { SET_LANGUAGE } from '../store/allactionsTypes';
import { useEffect, useState } from 'react';
import useThemeConstants from '../hooks/useThemeConstants';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import API_Data from '../constants/API_Data';

const Onboading1 = () => {
  const themeConstant = useThemeConstants();
  const handleNext = () => {
    router.replace(`${Routes.ONBOADRIND2}`);
  };

  const handleSkip = () => {
    router.replace(`${Routes.LOGIN}`);
    AsyncStorage.setItem('firstTime', 'false');
  };

  const { selectedLanguage } = useSelector((state) => state.AppReducer);
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    // find: 'Find',
    chargingStation: 'Charging Station',
    sumbitRateText: 'Select a station from every network available around you which are compatible with your car’s charging port.',
    skip: 'Skip',
    next: 'Next',
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

  return (
    <SafeAreaView style={styles.container}>
      {isTranslatesLoaded ? (
        <>
          <View style={styles.content}>
            <View style={styles.img}>
              <Image
                style={{ width: '100%', height: '100%' }}
                resizeMode='contain'
                source={require('../../assets/onboarding/frame1.png')}
              />
            </View>

            <Text style={styles.title}>{translateObj.find}</Text>
            <Text style={styles.subTitle}>{translateObj.chargingStation}</Text>
            <Text style={styles.txt}>{translateObj.sumbitRateText}</Text>

            <View style={styles.indicatorContainer}>
              <View style={[styles.indicator, { backgroundColor: ThemeConstant.PRIMARY_COLOR }]} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={handleSkip} style={styles.btn}>
              <Text style={{ ...styles.btnTxt, color: ThemeConstant.PRIMARY_COLOR }}>{translateObj.skip}</Text>
            </Pressable>
            <Pressable onPress={handleNext} style={{ ...styles.btn, backgroundColor: ThemeConstant.PRIMARY_COLOR }}>
              <Text style={styles.btnTxt}>{translateObj.next}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Onboading1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: ThemeConstant.PADDING_MAIN,
  },
  content: {
    flex: 1,
  },
  img: {
    marginVertical: scale(50),
    alignItems: 'center',
    height: moderateVerticalScale(220),
  },

  title: {
    fontSize: scale(21),
    color: '#000',
    fontWeight: '700',
  },
  subTitle: {
    fontSize: scale(32),
    color: '#000',
    fontWeight: '700',
    marginBottom: moderateScale(12),
  },
  txt: {
    fontSize: scale(20),
    color: '#999',
    marginBottom: moderateVerticalScale(18),
  },

  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(70),
    gap: scale(10),
  },
  indicator: {
    height: moderateVerticalScale(5),
    width: moderateScale(25),
    backgroundColor: '#e4e4e4',
    borderRadius: scale(100),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: moderateVerticalScale(24),
  },
  btn: {
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateVerticalScale(15),
    borderRadius: scale(50),
  },
  btnTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scale(16),
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
