import { StyleSheet, Text, View, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../constants/ThemeConstant';
import Routes from '../constants/Routes';
import { FlatList } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { SET_LANGUAGE } from '../store/allactionsTypes';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'i18n-js';

const OnboardingLanguage = () => {
  const dispatch = useDispatch();

  const { selectedLanguage } = useSelector((state) => state.AppReducer);
  const i18n = new I18n({
    ar: { title: 'لغة', selectText: 'اختر لغتك المفضلة', nextText: 'التالي' },
    en: { title: 'Language', selectText: 'Select your preferred Language', nextText: 'Next' },
    'zh-CN': { title: '语言', selectText: '选择您的首选语言', nextText: '下一个' },
    ru: { title: 'Язык', selectText: 'Выберите предпочитаемый язык', nextText: 'Следующий' },
    fr: { title: 'Langue', selectText: 'Sélectionnez votre langue préférée', nextText: 'Suivant' },
    hi: { title: 'भाषा', selectText: 'अपनी पसंदीदा भाषा चुनें', nextText: 'अगला' },
  });
  i18n.locale = selectedLanguage;

  const [selected, setSelectedLanguage] = useState(selectedLanguage);

  const languageList = [
    { title: 'عربي', image: require('../../assets/language/arabic.png'), code: 'ar' },
    { title: 'English', image: require('../../assets/language/english.png'), code: 'en' },
    { title: '中国人', image: require('../../assets/language/chinese.png'), code: 'zh-CN' },
    { title: 'русский', image: require('../../assets/language/russian.png'), code: 'ru' },
    { title: 'Français', image: require('../../assets/language/fransis.png'), code: 'fr' },
    // { title: 'Hindi', image: require('../../assets/language/english.png'), code: 'hi' },
  ];

  const handleNext = async () => {
    await AsyncStorage.setItem('SET_LANGUAGE', selected);
    dispatch({ type: SET_LANGUAGE, payload: selected });
    router.replace(`${Routes.ONBOADRIND1}`);
  };

  useEffect(() => {
    if (selectedLanguage) {
      i18n.locale = selectedLanguage;
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{i18n.t('title')}</Text>

        <Text style={styles.txt}>{i18n.t('selectText')}</Text>

        <FlatList
          scrollEnabled={false}
          style={{
            marginTop: scale(5),
            paddingHorizontal: 1,
            paddingVertical: 2,
          }}
          data={languageList}
          numColumns={3}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                i18n.locale = item.code;
                setSelectedLanguage(item.code);
                dispatch({ type: SET_LANGUAGE, payload: item.code });
              }}
              style={{
                ...(index == 1 || index == 4 || index == 7 || index == 10 ? { marginHorizontal: 10 } : {}),
                ...(selected == item.code ? styles.flatListElementSelected : styles.flatListElement),
              }}
            >
              {item.image ? <Image source={item.image} style={styles.typeImage} /> : null}
              {item.icon ? (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={25}
                  color={selected == item.code ? 'white' : ThemeConstant.PRIMARY_COLOR}
                />
              ) : null}
              <Text
                style={{
                  ...(item.image || item.icon ? { marginTop: scale(3) } : { height: '100%' }),
                  ...(selected == item.code ? styles.flatListElementTextSelected : styles.flatListElementText),
                }}
              >
                {item.title}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleNext} style={{ ...styles.btn, backgroundColor: ThemeConstant.PRIMARY_COLOR }}>
          <Text style={styles.btnTxt}>{i18n.t('nextText')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingLanguage;

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
    marginTop: scale(40),
    marginBottom: scale(30),
    fontSize: scale(25),
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
    fontSize: scale(14),
    color: '#000',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: moderateVerticalScale(24),
  },
  btn: {
    width: Dimensions.get('screen').width - 80,
    paddingHorizontal: moderateScale(40),
    paddingVertical: moderateVerticalScale(15),
    borderRadius: scale(50),
  },
  btnTxt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: scale(16),
  },
  flatListElement: {
    alignItems: 'center',
    width: (Dimensions.get('screen').width - 80) / 3,
    height: scale(85),
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: scale(5),
    paddingTop: scale(10),
    paddingBottom: scale(5),
    marginBottom: 8,
  },
  flatListElementSelected: {
    alignItems: 'center',
    width: (Dimensions.get('screen').width - 80) / 3,
    height: scale(85),
    borderWidth: 1.5,
    borderColor: ThemeConstant.PRIMARY_COLOR,
    borderRadius: scale(5),
    paddingTop: scale(10),
    paddingBottom: scale(5),
    marginBottom: 10,
  },
  flatListElementText: {
    color: ThemeConstant.BLACK,
    paddingTop: scale(2),
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: scale(12),
    fontWeight: '700',
  },
  flatListElementTextSelected: {
    paddingTop: scale(2),
    color: ThemeConstant.PRIMARY_COLOR,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: scale(12),
    fontWeight: '700',
  },
  typeImage: {
    borderRadius: 50,
    width: scale(40),
    height: scale(40),
  },
});
