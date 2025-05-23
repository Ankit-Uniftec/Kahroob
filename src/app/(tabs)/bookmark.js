import { FlatList, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';

import ThemeConstant from '../../constants/ThemeConstant';
import FilterItem from '../../components/bookmark/FilterItem';
import SearchBar from '../../components/SearchBar';
import BookmarkStations from '../../components/bookmark/chargingStations';
import { useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import useThemeConstants from '../../hooks/useThemeConstants';
import BookmarkAticles from '../../components/bookmark/articles';
import axios from 'axios';
import API_Data from '../../constants/API_Data';

const Bookmark = () => {
  const themeConstant = useThemeConstants();

  const { user } = useSelector((state) => state.AuthReducer);
  const { chargingStations } = useSelector((state) => state.ThemeReducer);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [categories, setCategories] = useState([]);

  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    bookmarkText: 'Bookmark',
    searchText: 'Search',
    classifiedsText: 'Classifieds',
    chargingStationText: 'Charging Stations',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
  }, [selectedLanguage]);

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
      setIsTranslatesLoaded(true);
      setCategories([
        { id: 1, title: initialTranslateObj.chargingStationText },
        { id: 2, title: initialTranslateObj.classifiedsText },
      ]);
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
        setCategories([
          { id: 1, title: newTranslationObj.chargingStationText },
          { id: 2, title: newTranslationObj.classifiedsText },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text?.trim() === '') {
      setFilteredData(allData);
    } else {
      const filteredFavorites = allData.filter((item) => {
        if (item.favType == 'station') {
          return (
            item.displayName?.text?.toLowerCase().includes(text.toLowerCase()) ||
            item.formattedAddress?.toLowerCase().includes(text.toLowerCase())
          );
        } else if (item.favType == 'article') {
          return (
            item.model?.name?.toLowerCase().includes(text?.toLowerCase()) ||
            item.manufacturer?.name?.toLowerCase().includes(text?.toLowerCase()) ||
            item.address?.toLowerCase().includes(text?.toLowerCase()) ||
            item.fuel?.toLowerCase().includes(text?.toLowerCase()) ||
            item.price?.toLowerCase().includes(text?.toLowerCase())
          );
        }
      });
      setFilteredData(filteredFavorites);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFilteredData([]);
      setSearchValue('');
      getClassifieds();
    }, [chargingStations, activeTab])
  );

  const getClassifieds = async () => {
    let allDataObj = [];
    try {
      const response = await axios.get(API_Data.url + 'classifieds', {
        params: { favourite: 'my' },
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        for (const item of response.data.page.items) {
          allDataObj.push({ ...item, favType: 'article' });
        }
      }
    } catch (error) {
      console.error('Error fetching Classifields:', error);
    }
    for (const item of chargingStations.filter((f) => f.userId === user?.id)) {
      allDataObj.push({ ...item, favType: 'station' });
    }
    setAllData(allDataObj);
    setFilteredData(allDataObj);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          <Text style={[styles.title, { color: themeConstant.TEXT_PRIMARY, marginBottom: moderateVerticalScale(20) }]}>
            {translateObj.bookmarkText}
          </Text>

          <View style={{ paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            <SearchBar placeholder={translateObj.searchText} value={searchValue} setValue={handleSearch} />
          </View>

          <View style={{ marginTop: 20 }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: scale(10), flex: 1, justifyContent: 'center' }}
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <FilterItem onPress={() => setActiveTab(index)} category={item.title} selected={activeTab == index} />
                );
              }}
              ListHeaderComponent={() => <View style={{ width: 10 }} />}
              ListFooterComponent={() => <View style={{ width: 10 }} />}
            />
          </View>

          <View style={{ paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            {activeTab == 0 && <BookmarkStations data={filteredData.filter((item) => item.favType == 'station')} />}
            {activeTab == 1 && <BookmarkAticles data={filteredData.filter((item) => item.favType == 'article')} />}
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

export default Bookmark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingHorizontal: ThemeConstant.PADDING_MAIN,
    fontWeight: '700',
    fontSize: 24,
    marginTop: 30,
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
