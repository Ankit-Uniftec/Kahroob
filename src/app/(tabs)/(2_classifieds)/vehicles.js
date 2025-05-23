import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  useWindowDimensions,
  Pressable,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../../constants/ThemeConstant';
import SearchBar from '../../../components/SearchBar';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Routes from '../../../constants/Routes';
import Header from '../../../components/Header';
import useThemeConstants from '../../../hooks/useThemeConstants';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';
import Carousel from 'react-native-reanimated-carousel';
import { FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/hi';
import 'moment/locale/ar';
import 'moment/locale/zh-cn';
import 'moment/locale/ru';
import 'moment/locale/fr';
import { useSelector } from 'react-redux';

const Vehicles = () => {
  const { width } = useWindowDimensions();
  const themeConstant = useThemeConstants();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const params = useLocalSearchParams();

  const [searchValue, setSearchValue] = useState('');
  const [filterData, setFilteredData] = useState([]);
  const [classifields, setClassifields] = useState([]);
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    searchText: 'Search',
    shareText: 'Check out this classified vehical',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useFocusEffect(
    useCallback(() => {
      getTranslatedData();
      getClassifiedData();
    }, [selectedLanguage])
  );

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

  const getClassifiedData = () => {
    if (params.model) {
      getClassifieds({
        model: params.model,
      });
    } else if (params.category) {
      getClassifieds({
        category: params.category,
      });
    } else if (params.host) {
      getClassifieds({
        host: params.host,
      });
    } else {
      getClassifieds({});
    }
  };

  const getClassifieds = async (params) => {
    try {
      const response = await axios.get(API_Data.url + 'classifieds', {
        params,
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        setClassifields(response.data.page.items);
        setFilteredData(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Classifields:', error);
      return null;
    }
  };

  const phone = '+918010801391';

  const openWhatsAppChat = () => {
    Linking.openURL(`https://wa.me/${phone}`);
  };

  const openPhoneDialer = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleShare = async (classified) => {
    try {
      const result = await Share.share({
        message: `${translateObj.shareText}: ${classified?.manufacturer?.name} • ${classified?.model?.name}`,
      });
    } catch (error) {
      alert(error.message);
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

  const markFavourite = async (classified, index) => {
    if (filterData[index]) {
      let isFav = filterData[index].isFav;
      try {
        let classifiedsObj = JSON.parse(JSON.stringify(filterData));
        if (classifiedsObj[index]) {
          classifiedsObj[index].isFav = !isFav;
          setFilteredData(classifiedsObj);
        }
        const response = await axios.put(
          API_Data.url + 'classifieds/favourite/' + classified.id,
          {
            favourite: isFav ? 'remove' : 'add',
          },
          {
            headers: API_Data.getHeaders(user, selectedLanguage),
          }
        );
        if (!response.data || !response.data.isSuccess) {
          console.error('Error updating Favourite:', error);
          let classifiedsObj = JSON.parse(JSON.stringify(filterData));
          if (classifiedsObj[index]) {
            classifiedsObj[index].isFav = isFav;
            setFilteredData(classifiedsObj);
          }
        }
      } catch (error) {
        let classifiedsObj = JSON.parse(JSON.stringify(filterData));
        if (classifiedsObj[index]) {
          classifiedsObj[index].isFav = isFav;
          setFilteredData(classifiedsObj);
        }
        console.error('Error updating Favourite:', error);
        return null;
      }
    }
  };

  const renderItem = ({ item, index }) => {
    let imageUrl =
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym13JTIwY2FyfGVufDB8fDB8fHww';

    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: Routes.CLASSIFIED_DETAIL,
            params: { classifield: JSON.stringify(item) },
          });
        }}
        style={{ ...styles.itemContainer, ...{ paddingHorizontal: ThemeConstant.PADDING_MAIN } }}
      >
        <View style={{ ...styles.cardContainer, ...{ width: width - scale(48), overflow: 'hidden' } }}>
          <View style={styles.fav}>
            <TouchableOpacity
              onPress={() => handleShare(item)}
              style={{
                width: scale(32),
                height: scale(32),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: scale(1000),
                marginRight: scale(8),
                borderWidth: 2,
                borderColor: themeConstant.PRIMARY_COLOR,
                aspectRatio: 1 / 1,
                zIndex: 1,
              }}
            >
              <Entypo name={'share'} size={20} color={themeConstant.PRIMARY_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => markFavourite(item, index)}
              activeOpacity={0.7}
              style={{
                width: scale(32),
                height: scale(32),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: scale(1000),
                borderWidth: 2,
                borderColor: themeConstant.PRIMARY_COLOR,
                aspectRatio: 1 / 1,
                zIndex: 1,
                // borderWidth:1,
              }}
            >
              <FontAwesome name={item.isFav ? 'bookmark' : 'bookmark-o'} size={20} color={themeConstant.PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
          <Carousel
            width={width - scale(48)}
            height={(width - scale(46)) / 2}
            data={item.images}
            scrollAnimationDuration={1000}
            // onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                  source={{
                    uri: item,
                  }}
                />
              </View>
            )}
          />
        </View>
        <View activeOpacity={0.8} style={styles.cardItemsContainer}>
          <View style={styles.detailContainer}>
            <View flex={1} style={{ flex: 1, justifyContent: 'center' }}>
              <View
                style={{
                  marginBottom: scale(5),
                  position: 'relative',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontWeight: '700', fontSize: scale(16), color: ThemeConstant.PRIMARY_COLOR }}>
                  AED {item?.price}
                </Text>
                <Text style={{ fontWeight: '400', fontSize: scale(8), color: '#000', opacity: 0.5 }}>
                  {getDate(item?.date)}
                </Text>
              </View>
              <View style={{ marginBottom: scale(5), flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: scale(14), color: '#000' }}>{item?.model?.name}</Text>
                <Text numberOfLines={2} style={{ fontWeight: '400', fontSize: scale(14), color: '#0E1617' }}>
                  {' '}
                  - {item?.fuel}
                </Text>
              </View>
              <Text style={{ marginBottom: scale(5), fontWeight: '400', fontSize: scale(10), color: '#000', opacity: 0.5 }}>
                {item?.year} • {item?.kilometers} km
              </Text>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: scale(10),
                  color: '#000',
                  opacity: 0.5,
                  borderBottomWidth: 0.5,
                  paddingBottom: scale(20),
                }}
              >
                <FontAwesome name={'map-marker'} size={10} color={'#000'} /> {item?.address}
              </Text>
              <View
                style={{
                  marginTop: scale(5),
                  position: 'relative',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    router.push({
                      pathname: Routes.CLASSIFIED_VEHICLES,
                      params: {
                        title: item?.host?.name ? item?.host?.name : item?.host?.firstName + ' ' + item?.host?.lastName,
                        host: item?.host?.id,
                      },
                    })
                  }
                >
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: scale(14),
                      color: ThemeConstant.PRIMARY_COLOR,
                    }}
                  >
                    <FontAwesome name={'user'} size={12} />{' '}
                    {item?.host?.name ? item?.host?.name : item?.host?.firstName + ' ' + item?.host?.lastName}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    marginTop: scale(5),
                    position: 'relative',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity onPress={openWhatsAppChat} activeOpacity={0.9} style={styles.rightIconContainer}>
                    <FontAwesome5 name='whatsapp' size={20} color='#fff' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openPhoneDialer} activeOpacity={0.9} style={styles.rightIconContainer}>
                    <FontAwesome5 name='phone' size={16} color='#fff' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleSearch = (text) => {
    setSearchValue(text);
    if (text?.trim() === '') {
      setFilteredData(classifields);
    } else {
      const filteredFavorites = classifields.filter(
        (item) =>
          item.model?.name?.toLowerCase().includes(text?.toLowerCase()) ||
          item.manufacturer?.name?.toLowerCase().includes(text?.toLowerCase()) ||
          item.address?.toLowerCase().includes(text?.toLowerCase()) ||
          item.fuel?.toLowerCase().includes(text?.toLowerCase()) ||
          item.price?.toLowerCase().includes(text?.toLowerCase())
      );
      setFilteredData(filteredFavorites);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={params?.title} />

          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
              <SearchBar placeholder={translateObj.searchText} value={searchValue} setValue={handleSearch} />
            </View>

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

export default Vehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scale(20),
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },
  itemContainer: {
    marginBottom: scale(5),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 5,
    paddingVertical: scale(10),
  },
  cardContainer: {
    backgroundColor: 'gray',
    borderRadius: scale(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  cardItemsContainer: {
    paddingTop: scale(8),
    gap: moderateScale(8),
    position: 'relative',
    flexDirection: 'row',
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
  rightIconContainer: {
    marginLeft: scale(10),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeConstant.PRIMARY_COLOR,
    borderRadius: scale(1000),
  },
  fav: {
    position: 'relative',
    flexDirection: 'row',
    position: 'absolute',
    top: scale(5),
    right: scale(10),
    zIndex: 999,
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
