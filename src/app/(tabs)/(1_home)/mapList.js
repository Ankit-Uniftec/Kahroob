import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

import ThemeConstant from '../../../constants/ThemeConstant';
import SearchBar from '../../../components/SearchBar';
import Routes from '../../../constants/Routes';
import Header from '../../../components/Header';
import useThemeConstants from '../../../hooks/useThemeConstants';
import { LocationContext } from '../../../context/location';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';

const MapList = () => {
  const themeConstant = useThemeConstants();

  const { evStations } = useSelector((state) => state.AppReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const { setEVStation } = useContext(LocationContext);

  const [searchValue, setSearchValue] = useState('');
  const [filterData, setFilteredData] = useState(evStations);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    mapListViewText: 'Map List View',
    searchText: 'Search',
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
      // console.log(JSON.stringify(response.data));
      if (response.data && response.data.isSuccess && response.data.data) {
        let newTranslationObj = response.data.data;
        setTranslateObj(newTranslationObj);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const handlePress = (item) => {
    setEVStation(item);
    router.push(Routes.HOME_STATION_DETAIL);
  };

  const renderItem = useCallback(({ item }) => {
    let imageUrlDummy =
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym13JTIwY2FyfGVufDB8fDB8fHww';

    const PHOTO_BASE_URL = 'https://places.googleapis.com/v1/';
    // const API_KEY = 'AIzaSyCKFKjyPUloNMA_aF0UN6n5kdUIUAjNK-0'
    const API_KEY = 'AIzaSyBbrdDseUJ1KBfawyv75WvES521hKJgo78';

    let imageUrl = '';
    if (item.photos && item.photos[0]) {
      imageUrl = `${PHOTO_BASE_URL}${item?.photos[0]?.name}/media?key=${API_KEY}&maxHeightPx=800&maxWidthPx=1200`;
    }

    return (
      <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.8} style={styles.cardContainer}>
        <Image
          style={styles.img}
          resizeMode='cover'
          source={item?.image ? item?.image : { uri: imageUrl || imageUrlDummy }}
        />

        <View style={styles.detailContainer}>
          <View flex={1} style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
            <Text style={{ fontWeight: '600', fontSize: scale(16), color: ThemeConstant.BLACK }}>
              {item?.displayName?.text}
            </Text>
            <Text style={{ fontWeight: '600', fontSize: scale(14), color: ThemeConstant.FADED_BLACK }}>
              {item?.formattedAddress.length <= 80 ? item?.formattedAddress : item?.formattedAddress.slice(0, 80) + '...'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontWeight: '700', fontSize: scale(8) }}>{item?.rating?.toFixed(1)}</Text>
              <View style={{ flexDirection: 'row', gap: scale(2) }}>
                {Array.from({ length: item.rating }, (_, index) => (
                  <AntDesign key={index} name='star' size={15} color='#FFB800' />
                ))}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text?.trim() === '') {
      setFilteredData(evStations);
    } else {
      const filteredFavorites = evStations.filter(
        (item) =>
          item?.displayName?.text?.toLowerCase().includes(text?.toLowerCase()) ||
          item?.formattedAddress?.toLowerCase().includes(text?.toLowerCase())
      );
      setFilteredData(filteredFavorites);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.mapListViewText} />

          <View style={{ flex: 1, marginTop: 14, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            <SearchBar placeholder={translateObj.searchText} value={searchValue} setValue={handleSearch} />

            <FlatList
              data={filterData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
              ListHeaderComponent={() => <View style={{ height: 10 }} />}
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

export default MapList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },

  //
  cardContainer: {
    // height: moderateVerticalScale(109),
    border:"1px solid red",
    backgroundColor: '#fff',
    padding: scale(8),
    position: 'relative',
    flexDirection: 'row',
    borderRadius: scale(10),
    gap: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  img: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(10),
    resizeMode: 'cover',
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
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
