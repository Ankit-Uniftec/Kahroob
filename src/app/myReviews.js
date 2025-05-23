import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/hi';
import 'moment/locale/ar';
import 'moment/locale/zh-cn';
import 'moment/locale/ru';
import 'moment/locale/fr';
import ThemeConstant from '../constants/ThemeConstant';
import SearchBar from '../components/SearchBar';
import Routes from '../constants/Routes';
import Header from '../components/Header';
import useThemeConstants from '../hooks/useThemeConstants';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_Data from '../constants/API_Data';

const MyReviews = () => {
  const themeConstant = useThemeConstants();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState([]);
  const [filterData, setFilteredData] = useState([]);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    myReviewText: 'My Reviews',
    searchText: 'Search',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
    getReviews();
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

  const getReviews = async () => {
    try {
      const response = await axios.get(API_Data.url + 'reviews', {
        params: {
          status: 'all',
          user: 'my',
        },
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        setData(response.data.page.items);
        setFilteredData(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Categories:', error);
      return null;
    }
  };

  const getDate = (date) => {
    let dateObj = moment(date);
    dateObj.locale('en');
    let monthObj = moment(date);
    monthObj.locale(selectedLanguage.toLowerCase());
    let yearObj = moment(date);
    yearObj.locale('en');
    return `${dateObj.format('DD')} ${monthObj.format('MMM')} ${yearObj.format('YYYY')}`;
  };

  const renderItem = useCallback(({ item }) => {
    let imageUrl =
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym13JTIwY2FyfGVufDB8fDB8fHww';

    return (
      <TouchableOpacity
        // onPress={() => router.push(Routes.CLASSIFIED_DETAIL)}
        activeOpacity={0.8}
        style={styles.cardContainer}
      >
        <Image style={styles.img} resizeMode='cover' source={item?.image ? item?.image : { uri: imageUrl }} />

        <View style={styles.detailContainer}>
          <Text style={{ fontWeight: '700', fontSize: scale(8), color: themeConstant.FADED_BLACK }}>
            {getDate(item.date)}
          </Text>
          <View flex={1} style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
            <Text style={{ fontWeight: '600', fontSize: scale(16), color: ThemeConstant.BLACK }}>{item?.title}</Text>
            <Text style={{ fontSize: scale(12), color: ThemeConstant.FADED_BLACK }}>{item.address}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontWeight: '700', fontSize: scale(8) }}>{item?.rating?.toFixed(1)}</Text>
              <View style={{ flexDirection: 'row', gap: scale(2) }}>
                {Array.from({ length: item.rating }, (_, index) => (
                  <AntDesign key={index} name='star' size={15} color='#FFB800' />
                ))}
              </View>
            </View>
            <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#000' }}>{item?.detail}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text?.trim() === '') {
      setFilteredData(data);
    } else {
      const filteredFavorites = data.filter(
        (item) =>
          item?.address?.toLowerCase().includes(text?.toLowerCase()) ||
          item?.rating?.toString()?.includes(text?.toLowerCase()) ||
          item?.title?.toLowerCase().includes(text?.toLowerCase())
      );
      setFilteredData(filteredFavorites);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.myReviewText} />

          <View style={{ flex: 1, marginTop: 14, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            <SearchBar placeholder={translateObj.searchText} value={searchValue} setValue={handleSearch} />

            <FlatList
              contentContainerStyle={{ gap: scale(12) }}
              data={filterData}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              renderItem={renderItem}
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

export default MyReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },

  //
  cardContainer: {
    // height: moderateVerticalScale(109),
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
    // justifyContent: "space-around"
  },
  iconContainer: {
    position: 'absolute',
    top: scale(10),
    right: scale(15),
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
