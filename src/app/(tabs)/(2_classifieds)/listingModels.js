import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../../constants/ThemeConstant';
import SearchBar from '../../../components/SearchBar';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Header from '../../../components/Header';
import useThemeConstants from '../../../hooks/useThemeConstants';
import { MaterialIcons } from '@expo/vector-icons';
import Routes from '../../../constants/Routes';

import { data } from './data';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';
import { useSelector } from 'react-redux';

const Listing = () => {
  const themeConstant = useThemeConstants();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [modelList, setModelList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterData, setFilteredData] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    searchText: 'Search',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
    getModels(params.id);
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

  const getModels = async (manufacturer) => {
    try {
      const response = await axios.get(API_Data.url + 'models', {
        params: {
          manufacturer: manufacturer,
        },
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        setModelList(response.data.page.items);
        setFilteredData(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Models:', error);
      return null;
    }
  };

  const handleSelect = (item) => {
    setSelectedManufacturer(item);
    navigation.navigate(Routes.CLASSIFIED_VEHICLES, { title: item?.name, model: item.id });
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity onPress={() => handleSelect(item)} activeOpacity={0.8} style={styles.cardContainer}>
          <View style={styles.detailContainer}>
            <Text style={{ fontWeight: '700', fontSize: scale(14), color: themeConstant.TEXT_PRIMARY }}>{item.name}</Text>
            {/* {item.name == selectedManufacturer?.name && (
              <MaterialIcons name='check' size={24} color={ThemeConstant.PRIMARY_COLOR} />
            )} */}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedManufacturer]
  );

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text?.trim() === '') {
      setFilteredData(modelList);
    } else {
      const filteredFavorites = modelList.filter((item) => item.name?.toLowerCase().includes(text?.toLowerCase()));
      setFilteredData(filteredFavorites);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={`${params?.title}`} />

          <View style={{ flex: 1, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            <SearchBar placeholder={translateObj.searchText} value={searchValue} setValue={handleSearch} />

            <FlatList
              contentContainerStyle={{ gap: scale(12) }}
              data={filterData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              renderItem={renderItem}
              ListHeaderComponent={() => <View style={{ height: 20 }} />}
              ListFooterComponent={() => <View style={{ height: 20 }} />}
            />
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

export default Listing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scale(20),
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },

  //
  cardContainer: {
    paddingHorizontal: scale(8),
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
    height: scale(32),
    alignItems: 'center',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
