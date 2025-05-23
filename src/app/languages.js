import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../constants/ThemeConstant';
import useThemeConstants from '../hooks/useThemeConstants';
import { I18n } from 'i18n-js';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LANGUAGE } from '../store/allactionsTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageList = [
  { title: 'عربي', image: require('../../assets/language/arabic.png'), code: 'ar' },
  { title: 'English', image: require('../../assets/language/english.png'), code: 'en' },
  { title: '中国人', image: require('../../assets/language/chinese.png'), code: 'zh-CN' },
  { title: 'русский', image: require('../../assets/language/russian.png'), code: 'ru' },
  { title: 'Français', image: require('../../assets/language/fransis.png'), code: 'fr' },
  // { title: 'Hindi', image: require('../../assets/language/english.png'), code: 'hi' },
];

const Listing = () => {
  const themeConstant = useThemeConstants();
  const dispatch = useDispatch();

  const { selectedLanguage } = useSelector((state) => state.AppReducer);
  const i18n = new I18n({
    ar: { title: 'لغة', suggested: 'مقترح' },
    en: { title: 'Language', suggested: 'Suggested' },
    'zh-CN': { title: '语言', suggested: '建议' },
    ru: { title: 'Язык', suggested: 'Предложенный' },
    fr: { title: 'Langue', suggested: 'Suggéré' },
    hi: { title: 'भाषा', suggested: 'सुझाव दिया' },
  });
  i18n.locale = selectedLanguage;

  const [selected, setSelected] = useState(selectedLanguage);

  useEffect(() => {
    if (selectedLanguage) {
      i18n.locale = selectedLanguage;
    }
  }, []);

  const renderItem = ({ item }) => {
    console.log(selectedLanguage);
    return (
      <TouchableOpacity
        onPress={async () => {
          i18n.locale = item.code;
          setSelected(item.code);
          await AsyncStorage.setItem('SET_LANGUAGE', item.code);
          dispatch({ type: SET_LANGUAGE, payload: item.code });
        }}
        activeOpacity={0.8}
        style={styles.cardContainer}
      >
        <View style={styles.detailContainer}>
          <Text
            style={[
              styles.txt,
              { color: themeConstant.TEXT_PRIMARY },
              item.code == selected && { color: themeConstant.PRIMARY_COLOR },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {/* Header */}
      <Header title={i18n.t('title')} />

      <View style={{ flex: 1, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
        <Text style={{ marginTop: 20, fontSize: scale(16), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
          {i18n.t('suggested')}
        </Text>
        <FlatList
          data={languageList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ borderBottomColor: '#96A7AF', borderBottomWidth: 1 }} />}
          ListHeaderComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Listing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },

  //
  cardContainer: {
    // padding: scale(8),
    paddingVertical: moderateVerticalScale(14),
    position: 'relative',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: scale(14),
  },
});
