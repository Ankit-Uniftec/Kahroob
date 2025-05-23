import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../../constants/ThemeConstant';
import SearchBar from '../../../components/SearchBar';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Routes from '../../../constants/Routes';
import Header from '../../../components/Header';
import useThemeConstants from '../../../hooks/useThemeConstants';
// import { data } from './data';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_Data from '../../../constants/API_Data';

const Listing = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const themeConstant = useThemeConstants();

  const [manufacturerList, setManufacturerList] = useState([]);
  const [filterData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const { category, categoryName } = useLocalSearchParams();
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    searchText: 'Search',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
    setSelectedCategoryId(category);
    setSelectedCategory(categoryName);
    getManufacturers(category);
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

  const getManufacturers = async (category) => {
    try {
      const response = await axios.get(API_Data.url + 'manufacturers', {
        params: {
          category: category,
        },
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      // console.log(response.data.page.items)
      if (response.data && response.data.isSuccess && response.data.page) {
        setManufacturerList(response.data.page.items);
        setFilteredData(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Manufacturers:', error);
      return null;
    }
  };

  const handleManufacturerSelect = (data) => {
    let manufacturer = {
      id: data?.id,
      title: data?.name || '',
      categoryName: categoryName,
      categoryId: selectedCategoryId,
    };
    navigation.navigate(Routes.CLASSIFIED_LISTING_MODELS, manufacturer);
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleManufacturerSelect(item)} activeOpacity={0.8} style={styles.cardContainer}>
        <View style={styles.detailContainer}>
          <Text style={{ fontWeight: '700', fontSize: scale(14), color: themeConstant.TEXT_PRIMARY }}>{item.name}</Text>
          {/* {item.manufacturer == selectedManufacturer?.manufacturer && <MaterialIcons name="check" size={24} color={ThemeConstant.PRIMARY_COLOR} />} */}
        </View>
      </TouchableOpacity>
    );
  }, []);

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text?.trim() === '') {
      setFilteredData(manufacturerList);
    } else {
      const filteredFavorites = manufacturerList.filter((item) => item.name?.toLowerCase().includes(text?.toLowerCase()));
      setFilteredData(filteredFavorites);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={selectedCategory?.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase()} />

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
