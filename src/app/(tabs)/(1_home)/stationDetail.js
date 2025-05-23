import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
  Share,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import BackButton from '../../../components/BackButton';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemeConstant from '../../../constants/ThemeConstant';
import { moderateVerticalScale, scale, moderateScale } from 'react-native-size-matters';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';
import Line from '../../../components/profile/line';
import MapView, { Marker } from 'react-native-maps';
import CustomButton from '../../../components/CustomButton';
import AddReviewModal from '../../../components/home/AddReviewModal';
import { LocationContext } from '../../../context/location';
import PIN from '../../../../assets/custom_pin_1.png';

import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_STATIONS, REMOVE_FAVORITE, UPDATE_FAVORITE } from '../../../store/allactionsTypes';
import { getIconType } from '@rneui/base';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';

const StationDetail = () => {
  const [amenities, setAmenities] = useState([
    {
      id: 0,
      name: 'Parking',
      isPaid: true,
    },
    {
      id: 1,
      name: 'Lodging',
      isPaid: false,
    },
    {
      id: 2,
      name: 'Dining',
      isPaid: false,
    },
    {
      id: 3,
      name: 'Shopping',
      isPaid: false,
    },
  ])
  const dispatch = useDispatch();
  const { EVStation, calculation } = useContext(LocationContext);

  const { user } = useSelector((state) => state.AuthReducer);
  const { chargingStations } = useSelector((state) => state.ThemeReducer);

  let findIndex = chargingStations.findIndex((f) => f.userId === user?.id && f.id == EVStation.id);
  const [isFavorite, setIsFavorite] = useState(findIndex !== -1);

  const { width } = useWindowDimensions();
  const [chargersShowing, setChargersShowing] = useState(true);
  const [timingsShowing, setTimingShowing] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    addReviewText: 'Add Review',
    getDirectionsText: 'Get Directions',
    amenitiesText: 'Amenities',
    paidText: 'Paid',
    chargersText: 'Chargers',
    portsText: 'Ports',
    openText: 'Open',
    timingsText: 'Timings',
    reportStationText: 'Report Station',
    locationText: 'Location',
    checkOutShareText: 'Check out this EV station',
    Parking: 'Parking',
    Lodging: 'Lodging',
    Dining: 'Dining',
    Shopping: 'Shopping'
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
        const newAmenities = [{
          id: 0,
          name: newTranslationObj.Parking,
          isPaid: true,
        },
        {
          id: 1,
          name: newTranslationObj.Lodging,
          isPaid: false,
        },
        {
          id: 2,
          name: newTranslationObj.Dining,
          isPaid: false,
        },
        {
          id: 3,
          name: newTranslationObj.Shopping,
          isPaid: false,
        }]
        setAmenities(newAmenities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const openGoogleMaps = () => {
    const { latitude, longitude } = EVStation.location;
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${EVStation?.formattedAddress}`,
      android: `geo:${latitude},${longitude}?q=${EVStation?.formattedAddress}`,
    });
    console.log(url, '>>>>>>>>>>>>>>>>>>>>>Hello world');
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const handleFavorite = async () => {
    if (findIndex !== -1) {
      // If already favorite, remove it
      let updatedStations = [...chargingStations];
      updatedStations.splice(findIndex, 1);
      dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
      setIsFavorite(false);
    } else {
      // If not favorite, add it
      let updatedStations = [...chargingStations, { userId: user?.id, ...EVStation }];
      dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
      setIsFavorite(true);
    }
  };

  const getVehicleType = (code) => {
    let name = 'Other';
    switch (code) {
      case 'EV_CONNECTOR_TYPE_OTHER':
        name = 'Other';
        break;
      case 'EV_CONNECTOR_TYPE_J1772':
        name = 'J-1772';
        break;
      case 'EV_CONNECTOR_TYPE_J1772':
        name = 'J-1772';
        break;
      case 'EV_CONNECTOR_TYPE_TYPE_2':
        name = 'Type 2';
        break;
      case 'EV_CONNECTOR_TYPE_CHADEMO':
        name = 'CHAdeMO';
        break;
      case 'EV_CONNECTOR_TYPE_TESLA':
        name = 'Type 2';
        break;
      case 'EV_CONNECTOR_TYPE_UNSPECIFIED_GB_T':
        name = 'GB/T';
        break;
      case 'EV_CONNECTOR_TYPE_UNSPECIFIED_WALL_OUTLET':
        name = 'Wall';
        break;
      case 'EV_CONNECTOR_TYPE_CCS_COMBO_1':
        name = 'CCS/SAE';
        break;
      case 'EV_CONNECTOR_TYPE_CCS_COMBO_2':
        name = 'CCS/Mennekes';
        break;
      default:
        name = 'Other';
    }
    return name;
  };

  const getVehicleIcon = (code) => {
    let name = 'Other';
    switch (code) {
      case 'EV_CONNECTOR_TYPE_OTHER':
        name = 'power-plug';
        break;
      case 'EV_CONNECTOR_TYPE_J1772':
        name = 'ev-plug-type1';
        break;
      case 'EV_CONNECTOR_TYPE_TYPE_2':
        name = 'ev-plug-type2';
        break;
      case 'EV_CONNECTOR_TYPE_CHADEMO':
        name = 'ev-plug-chademo';
        break;
      case 'EV_CONNECTOR_TYPE_TESLA':
        name = 'ev-plug-tesla';
        break;
      case 'EV_CONNECTOR_TYPE_UNSPECIFIED_GB_T':
        name = 'power-plug';
        break;
      case 'EV_CONNECTOR_TYPE_UNSPECIFIED_WALL_OUTLET':
        name = 'power-socket';
        break;
      case 'EV_CONNECTOR_TYPE_CCS_COMBO_1':
        name = 'ev-plug-ccs1';
        break;
      case 'EV_CONNECTOR_TYPE_CCS_COMBO_2':
        name = 'ev-plug-ccs2';
        break;
      default:
        name = 'power-plug';
    }
    return name;
  };

  const getAllFavorites = (userId) => {
    return db
      .collection('favorites')
      .doc(userId)
      .collection('stations')
      .get()
      .then((querySnapshot) => {
        const favorites = [];
        querySnapshot.forEach((doc) => {
          favorites.push({ id: doc.id, ...doc.data() });
        });
        return favorites;
      })
      .catch((error) => {
        console.error('Error getting favorites: ', error);
        return [];
      });
  };

  const removeFavorite = (userId, name) => {
    dispatch({ type: REMOVE_FAVORITE, payload: { userId, name } });
  };

  const handleShare = async () => {
    const { latitude, longitude } = EVStation.location;
    const mapUrl = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`,
      android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    try {
      const result = await Share.share({
        message: `${translateObj.checkOutShareText}: ${EVStation.displayName.text}, located at ${EVStation.formattedAddress}. ${mapUrl}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
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
              <BackButton />
              <Entypo name='dots-three-vertical' size={24} color='black' />
            </View>
            <View>
              <Carousel
                data={EVStation.photos}
                width={width}
                height={width / 1.5}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item }) => {
                  const PHOTO_BASE_URL = 'https://places.googleapis.com/v1/';
                  // const API_KEY = 'AIzaSyCKFKjyPUloNMA_aF0UN6n5kdUIUAjNK-0';
                  const API_KEY = 'AIzaSyBbrdDseUJ1KBfawyv75WvES521hKJgo78';

                  let imageUrl = `${PHOTO_BASE_URL}${item.name}/media?key=${API_KEY}&maxHeightPx=800&maxWidthPx=1200`;

                  return (
                    <View style={{ flex: 1 }}>
                      <Image source={{ uri: imageUrl }} style={{ flex: 1, resizeMode: 'cover' }} />
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: ThemeConstant.PADDING_MAIN,
              paddingBottom: moderateVerticalScale(20),
              gap: scale(20),
            }}
          >
            {/* STATION DETAILS */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ gap: scale(10), flex: 1 }}>
                <View style={{ gap: scale(10) }}>
                  <Text style={{ fontWeight: '700', fontSize: scale(12) }}>{``}</Text>
                  <Text style={{ fontWeight: '700', fontSize: scale(16) }}>{EVStation?.displayName?.text}</Text>
                  <Text style={{ fontWeight: '400', fontSize: scale(10) }}>{EVStation?.formattedAddress}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                  <Text style={{ fontWeight: '700', fontSize: scale(8) }}>{EVStation?.rating?.toFixed(1)}</Text>
                  <View style={{ flexDirection: 'row', gap: scale(2) }}>
                    {/* EVStation.rating */}
                    {Array.from({ length: EVStation.rating }, (_, index) => (
                      <AntDesign key={index} name='star' size={15} color='#FFB800' />
                    ))}
                  </View>

                  <Text style={{ fontWeight: '400', fontSize: scale(8), color: ThemeConstant.FADED_BLACK }}>
                    ({EVStation?.userRatingCount} reviews)
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                  <View
                    style={{
                      backgroundColor: EVStation?.currentOpeningHours?.openNow ? ThemeConstant.PRIMARY_COLOR : 'gray',
                      borderRadius: scale(5),
                      paddingHorizontal: moderateScale(10),
                      paddingVertical: moderateVerticalScale(8),
                    }}
                  >
                    <Text style={{ fontWeight: '700', fontSize: scale(8), color: '#fff' }}>
                      {EVStation?.currentOpeningHours?.openNow ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(2) }}>
                    <Entypo name='location-pin' size={20} color={ThemeConstant.FADED_BLACK} />
                    <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>
                      {calculation?.distance}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(5) }}>
                    <AntDesign name='car' size={20} color={ThemeConstant.FADED_BLACK} />
                    <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>
                      {calculation?.duration}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: scale(30) }}>
                <AntDesign onPress={handleShare} name='sharealt' size={24} color='black' />
                <FontAwesome
                  onPress={handleFavorite}
                  name={isFavorite ? 'bookmark' : 'bookmark-o'}
                  size={24}
                  color={!isFavorite ? '#000' : '#00CC44'}
                />
              </View>
            </View>

            <Line />

            {/* BUTTONS */}
            <View style={{ gap: scale(8), flexDirection: 'row' }}>
              <View style={{ width: '50%' }}>
                <CustomButton
                  title={translateObj.addReviewText}
                  type='outline'
                  onPress={() => setReviewModalVisible(true)}
                />
              </View>
              <View style={{ width: '50%' }}>
                <CustomButton onPress={openGoogleMaps} title={translateObj.getDirectionsText} />
              </View>
            </View>

            <Line />

            {/* ABOUT */}
            {/* <View style={{ gap: scale(10) }}>
                    <Text style={{ fontWeight: '700', fontSize: scale(15) }}>About</Text>
                    <View style={{
                        gap: scale(20)
                    }}>
                        <Text style={{ fontWeight: '400', fontSize: scale(12), lineHeight: scale(18) }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum debitis aut explicabo voluptates dicta iusto velit, repellat odit unde minima non optio officiis, reiciendis sit recusandae reprehenderit dolores esse? Ab.</Text>
                        <Line />
                    </View>
                </View> */}

            {/* Amenities */}
            <View style={{ gap: scale(10) }}>
              <Text style={{ fontWeight: '400', fontSize: scale(8), color: ThemeConstant.FADED_BLACK }}>
                {translateObj.amenitiesText}
              </Text>
              <View>
                <FlatList
                  contentContainerStyle={{ flex: 1, gap: scale(10) }}
                  horizontal
                  data={amenities}
                  key={(item, index) => item.id + index}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: scale(10) }}>{item.name}</Text>
                        <Text style={{ fontSize: scale(10) }}>{`${item.isPaid ? `(${translateObj.paidText})` : ''}`}</Text>
                        {index < amenities.length - 1 && (
                          <Text style={{ fontWeight: 'bold', fontSize: scale(14), marginLeft: scale(10) }}>•</Text>
                        )}
                      </View>
                    );
                  }}
                />
              </View>
            </View>

            <Line />

            {/* CHARGERS */}
            <View
              style={{
                borderWidth: 1,
                borderColor: '#d4d4d4',
                padding: scale(10),
                borderRadius: scale(5),
                gap: scale(10),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: scale(12) }}>{translateObj.chargersText}</Text>
                <TouchableOpacity onPress={() => setChargersShowing(!chargersShowing)}>
                  <Entypo name={chargersShowing ? 'chevron-small-up' : 'chevron-small-down'} size={24} color='black' />
                </TouchableOpacity>
              </View>

              {chargersShowing && <Line />}

              {chargersShowing && (
                <View style={{ gap: scale(10) }}>
                  {EVStation?.evChargeOptions?.connectorAggregation?.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: scale(10),
                          }}
                        >
                          <MaterialCommunityIcons name={getVehicleIcon(item?.type)} size={24} color='black' />
                          <Text style={{ fontWeight: '400', fontSize: scale(12) }}>{getVehicleType(item?.type)}</Text>
                        </View>
                        <Text style={{ fontWeight: '700', fontSize: scale(10), fontStyle: 'italic' }}>
                          {item?.count} {translateObj.portsText} ({Number(item?.maxChargeRateKw).toFixed(0)} KW)
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* TIMINGS */}
            <View
              style={{
                borderWidth: 1,
                borderColor: '#d4d4d4',
                padding: scale(10),
                borderRadius: scale(5),
                gap: scale(10),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: '700', fontSize: scale(12), color: ThemeConstant.PRIMARY_COLOR }}>
                    {translateObj.openText}
                  </Text>
                  <Text style={{ fontWeight: '700', fontSize: scale(12) }}> - {translateObj.timingsText}</Text>
                </View>
                <TouchableOpacity onPress={() => setTimingShowing(!timingsShowing)}>
                  <Entypo name={timingsShowing ? 'chevron-small-up' : 'chevron-small-down'} size={24} color='black' />
                </TouchableOpacity>
              </View>

              {timingsShowing && <Line />}

              {timingsShowing && (
                <View style={{ gap: scale(10) }}>
                  {EVStation?.currentOpeningHours?.weekdayDescriptions?.map((description, index) => {
                    const [day, timingRange] = description.split(': ');

                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontWeight: '400', fontSize: scale(12) }}>{day}</Text>
                        <Text style={{ fontWeight: '700', fontSize: scale(10), fontStyle: 'italic' }}>{timingRange}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Report Station */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: scale(5),
              }}
            >
              <Feather name='alert-triangle' size={20} color='red' />
              <Text style={{ color: 'red' }}>{translateObj.reportStationText}</Text>
            </TouchableOpacity>

            {/* MAP */}
            <View style={{ gap: scale(10) }}>
              <Text style={{ fontWeight: '700', fontSize: scale(15) }}>{translateObj.locationText}</Text>
              <View style={{ height: scale(200) }}>
                <MapView
                  style={styles.map}
                  provider='google'
                  initialRegion={{
                    latitude: EVStation?.location?.latitude,
                    longitude: EVStation?.location?.longitude,
                    latitudeDelta: 0.0422,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: EVStation?.location?.latitude, longitude: EVStation?.location?.longitude }}
                  >
                    <Image
                      source={PIN}
                      style={{ width: 32, height: 32 }} 
                      resizeMode="contain"
                    />
                  </Marker>
                </MapView>
              </View>
            </View>
          </ScrollView>
          <AddReviewModal isVisible={reviewModalVisible} setIsVisible={setReviewModalVisible} EVStation={EVStation} />
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default StationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scale(20),
    position: 'relative',
    backgroundColor: '#fff',
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
