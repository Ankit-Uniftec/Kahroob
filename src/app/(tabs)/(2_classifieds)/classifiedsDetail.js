import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { Entypo } from '@expo/vector-icons';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import { AntDesign, FontAwesome, FontAwesome5, Feather } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/hi';
import 'moment/locale/ar';
import 'moment/locale/zh-cn';
import 'moment/locale/ru';
import 'moment/locale/fr';
import BackButton from '../../../components/BackButton';
import ThemeConstant from '../../../constants/ThemeConstant';
import { BOOKMARK_CLASSIFIED } from '../../../store/allactionsTypes';
import Line from '../../../components/profile/line';
import Advert from '../../../components/classifieds/Advert';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';
import AdvertMulti from '../../../components/classifieds/AdvertMulti';

const ClassifiedsDetail = () => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const params = useLocalSearchParams();

  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [advertisments, setAdvertisments] = useState([]);
  const [classifield, setClassifield] = useState([]);
  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    searchText: 'Search',
    shareText: 'Check out this classified vehical',
    exploreText: 'Explore in-depth product details, including specifications and unique features.',
    amountText: 'AED',
    detailText: 'Details',
    modelText: 'Model',
    kilometerText: 'Kilometers',
    yearText: 'Year',
    engineText: 'Engine',
    sellerText: 'Seller',
    idText: 'ID',
    memberSinceText: 'Member since',
    reportAdvertismentText: 'Report Advertisement',
    addressText: 'Address',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
    if (params.classifield && params.classifield.length) {
      setClassifield(JSON.parse(params.classifield));
    }
  }, [selectedLanguage]);

  useEffect(() => {
    axios
      .get(API_Data.url + 'advertisments', {
        params: {
          pages: 'classified',
        },
        headers: API_Data.getHeaders(user, selectedLanguage),
      })
      .then((response) => {
        if (response.data && response.data.isSuccess && response.data.page) {
          setAdvertisments(response.data.page.items);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error fetching Categories:', error);
        return null;
      });
  }, []);

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

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${translateObj.shareText}: ${classifield?.manufacturer?.name} • ${classifield?.model?.name}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const markFavourite = async () => {
    let isFav = classifield.isFav;
    try {
      const response = await axios.put(
        API_Data.url + 'classifieds/favourite/' + classifield.id,
        {
          favourite: isFav ? 'remove' : 'add',
        },
        {
          headers: API_Data.getHeaders(user, selectedLanguage),
        }
      );
      if (response.data && response.data.isSuccess) {
        let classifiedObj = JSON.parse(JSON.stringify(classifield));
        classifiedObj.isFav = !isFav;
        setClassifield(classifiedObj);
      }
    } catch (error) {
      console.error('Error updating Favourite:', error);
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

  const getYear = (date) => {
    let dateObj = moment(date);
    dateObj.locale('en');
    return dateObj.format('YYYY');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {isTranslatesLoaded ? (
        <>
          {/* Carousel */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                paddingHorizontal: ThemeConstant.PADDING_MAIN,
                zIndex: 2,
                top: moderateVerticalScale(10),
              }}
            >
              <BackButton color='black' />
              <Entypo name='dots-three-vertical' size={24} color='black' />
            </View>
            <View>
              <Carousel
                // loop
                width={width}
                height={width / 2}
                // autoPlay={true}
                data={classifield.images}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item, index }) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      // borderWidth: 1,
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
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: ThemeConstant.PADDING_MAIN,
              paddingBottom: moderateVerticalScale(20),
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: scale(20), color: ThemeConstant.PRIMARY_COLOR }}>
                {translateObj.amountText} {classifield.price}
              </Text>
              <View style={{ flexDirection: 'row', gap: scale(30) }}>
                <AntDesign onPress={handleShare} name='sharealt' size={24} color='black' />
                <FontAwesome
                  onPress={markFavourite}
                  name={classifield.isFav ? 'bookmark' : 'bookmark-o'}
                  size={24}
                  color={!classifield.isFav ? '#000' : '#00CC44'}
                />
              </View>
            </View>

            <View style={{ marginVertical: moderateVerticalScale(8) }}>
              <Line />
            </View>

            <View style={{ gap: scale(8) }}>
              <Text style={{ fontWeight: '700', fontSize: scale(18) }}>
                {classifield?.manufacturer?.name} • {classifield?.model?.name}
              </Text>
              <Text style={{ fontWeight: '400', fontSize: scale(12) }}>{translateObj.exploreText}</Text>
            </View>

            <View
              style={{
                marginTop: moderateVerticalScale(10),
                gap: scale(15),
                marginBottom: moderateVerticalScale(20),
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: scale(15) }}>{translateObj.detailText}</Text>

              <View
                style={{
                  gap: scale(10),
                }}
              >
                <View style={styles.itemseparate}>
                  <Text style={styles.detailTitle}>{translateObj.modelText}</Text>
                  <Text>{classifield.model?.name}</Text>
                </View>

                <Line />

                <View style={styles.itemseparate}>
                  <Text style={styles.detailTitle}>{translateObj.yearText}</Text>
                  <Text>{classifield.year}</Text>
                </View>

                <Line />

                <View style={styles.itemseparate}>
                  <Text style={styles.detailTitle}>{translateObj.kilometerText}</Text>
                  <Text>{classifield.kilometers}</Text>
                </View>

                <Line />

                <View style={styles.itemseparate}>
                  <Text style={styles.detailTitle}>{translateObj.engineText}</Text>
                  <Text>{classifield.fuel}</Text>
                </View>

                <Line />
              </View>
            </View>

            {advertisments && advertisments.length ? (
              <View>
                <AdvertMulti advertisments={advertisments} />
              </View>
            ) : null}

            <View style={styles.sellercard}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '60%', fontWeight: '400', fontSize: scale(12), color: ThemeConstant.FADED_BLACK }}>
                  {translateObj.sellerText}
                </Text>
                <Text style={{ width: '40%', fontWeight: '400', fontSize: scale(12), color: ThemeConstant.FADED_BLACK }}>
                  {translateObj.idText}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '60%', fontWeight: '700', fontSize: scale(14) }}>{classifield?.host?.name}</Text>
                <Text numberOfLines={1} style={{ width: '40%', fontWeight: '700', fontSize: scale(12) }}>
                  {classifield?.host?.id}
                </Text>
              </View>

              <Text style={{ width: '50%', fontWeight: '400', fontSize: scale(12) }}>
                {translateObj.memberSinceText} {getYear(classifield?.host?.createdDate)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: scale(5),
                marginBottom: moderateVerticalScale(20),
              }}
            >
              <Feather name='alert-triangle' size={24} color='red' />
              <Text style={{ color: 'red' }}>{translateObj.reportAdvertismentText}</Text>
            </TouchableOpacity>

            <View style={{ gap: scale(20) }}>
              <Text style={{ fontWeight: '700', fontSize: scale(15) }}>{translateObj.addressText}</Text>
              <Text style={{ fontWeight: '400', fontSize: scale(13) }}>{classifield.address}</Text>
              <View
                style={{
                  height: moderateVerticalScale(200),
                }}
              >
                <MapView style={styles.map} />
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute',
              bottom: scale(20),
              right: scale(20),
              gap: scale(10),
            }}
          >
            <TouchableOpacity onPress={openWhatsAppChat} activeOpacity={0.9} style={styles.iconContainer}>
              <FontAwesome5 name='whatsapp' size={24} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity onPress={openPhoneDialer} activeOpacity={0.9} style={styles.iconContainer}>
              <FontAwesome5 name='phone' size={20} color='#fff' />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ClassifiedsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scale(20),
    position: 'relative',
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeConstant.PRIMARY_COLOR,
    borderRadius: scale(1000),
  },
  itemseparate: {
    flexDirection: 'row',
  },
  detailTitle: {
    fontWeight: '700',
    fontSize: scale(12),
    width: '50%',
  },
  sellercard: {
    marginVertical: moderateVerticalScale(20),
    backgroundColor: '#fff',
    padding: scale(15),
    borderRadius: scale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    gap: scale(5),
  },
  map: {
    width: '100%',
    height: '100%',
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
