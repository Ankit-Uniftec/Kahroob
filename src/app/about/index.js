import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import DrawerMenuItem from '../../components/DrawerMenuItem';
import { router } from 'expo-router';
import Routes from '../../constants/Routes';
import useThemeConstants from '../../hooks/useThemeConstants';
import ThemeConstant from '../../constants/ThemeConstant';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_Data from '../../constants/API_Data';
import { useEffect, useState } from 'react';

const AboutUs = () => {
  const themeConstant = useThemeConstants();

  const { isDark } = useSelector((state) => state.ThemeReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    aboutUsText: 'About us',
    lastUpdatedText: 'Last updated on 23rd March 2024',
    aboutDetailsText:
      'Kahroob is your to-go to app for anything and everything related to your electric vehicle (EVs). Whether you\'re a long time owner or just bought your new EV, you can use Kahroob to show you around the EV charging locations, accessories your ride, buy another pre-loved EV or even engage with other EV owners and show off your car or send out an inquiry on our forums and steer up a friendly informative conversation (YES We brought that back!) We trying to build a community that help its members not to stray uncharged at an inoperational station :), help with recycling the used parts and accessories and keep us updated with what new in EV world!',
    termsText: 'Terms of Use',
    feedbackText: 'Feedback',
    followText: 'Follow us on Social Media',
    visitWebsiteText: 'Visit our Website',
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
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.aboutUsText} />

          <View style={{ flex: 1 }}>
            <View style={{ gap: 20, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
              <View>
                <Text style={{ fontSize: scale(20), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>v1.2.0</Text>
                <Text style={{ fontSize: scale(12), color: '#96A7AF' }}>{translateObj.lastUpdatedText}</Text>
              </View>
              <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
                {translateObj.aboutDetailsText}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                gap: 20,
                marginTop: moderateVerticalScale(30),
                backgroundColor: isDark ? themeConstant.THEME : '#F6F6F6',
                paddingTop: 20,
                paddingHorizontal: ThemeConstant.PADDING_MAIN,
              }}
            >
              <DrawerMenuItem name={translateObj.termsText} onClick={() => router.push(Routes.TERMS_OF_USE)} />
              {/* <DrawerMenuItem name={translateObj.feedbackText} onClick={() => router.push(Routes.FEEDBACK)} /> */}
              <DrawerMenuItem name={translateObj.followText} onClick={() => router.push(Routes.FOLLOW_SOCIAL_MEDIA)} />
              <DrawerMenuItem name={translateObj.visitWebsiteText} />
            </View>
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

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
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
