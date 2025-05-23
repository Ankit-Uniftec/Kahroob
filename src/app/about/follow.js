import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import Header from '../../components/Header';
import useThemeConstants from '../../hooks/useThemeConstants';
import ThemeConstant from '../../constants/ThemeConstant';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_Data from '../../constants/API_Data';

const Follow = () => {
  const themeConstant = useThemeConstants();
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    followSocialText: 'Follow us on Social Media',
    facebookText: 'Facebook',
    instagramText: 'Instagram',
    twitterText: 'Twitter',
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
          <Header title={translateObj.followSocialText} />

          <View style={{ marginTop: 10, gap: 20, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            <View style={styles.line} />
            {/* Facebook */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  source={require('../../../assets/facebook-icon.png')}
                  resizeMode='contain'
                  style={[styles.icon, { tintColor: themeConstant.TEXT_PRIMARY }]}
                />
                <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
                  {translateObj.facebookText}
                </Text>
              </View>
              <Image source={require('../../../assets/back-icon.png')} resizeMode='contain' style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.line} />

            {/* Instagram */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  source={require('../../../assets/insta-icon.png')}
                  resizeMode='contain'
                  style={[styles.icon, { tintColor: themeConstant.TEXT_PRIMARY }]}
                />
                <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
                  {translateObj.instagramText}
                </Text>
              </View>
              <Image source={require('../../../assets/back-icon.png')} resizeMode='contain' style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.line} />

            {/* Twitter */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  source={require('../../../assets/twitter-icon.png')}
                  resizeMode='contain'
                  style={[styles.icon, { tintColor: themeConstant.TEXT_PRIMARY }]}
                />
                <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
                  {translateObj.twitterText}
                </Text>
              </View>
              <Image source={require('../../../assets/back-icon.png')} resizeMode='contain' style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.line} />
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

export default Follow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
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
