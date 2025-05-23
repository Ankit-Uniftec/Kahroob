import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

import MapApiFetch from '../../../utils/MapApiFetch';
import ThemeConstant from '../../../constants/ThemeConstant';
import { EV_STATIONS, LOGOUT, UPDATE_COUNTRY, HOME_ROUTE, KEYBOARD_OPEN } from '../../../store/allactionsTypes';
import { LocationContext } from '../../../context/location';
import Routes from '../../../constants/Routes';
import Advert from '../../../components/classifieds/Advert';
import HomeModal from '../../../components/home/HomeModal';
import GoogleSearchBar from '../../../components/GoogleSearchBar';
import DrawerButton from '../../../components/DrawerButton';

import PIN from '../../../../assets/custom_pin_1.png';
import MY_LOCATION from '../../../../assets/my_location_1.png';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';

import { SET_LANGUAGE } from '../../../store/allactionsTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdvertMulti from '../../../components/classifieds/AdvertMulti';

const { width, height } = Dimensions.get('window');

const Page = () => {
  const dispatch = useDispatch();

  const EVConnectorMapping = {
    EV_CONNECTOR_TYPE_OTHER: ['OTHER'], //
    EV_CONNECTOR_TYPE_J1772: ['J_1772'], //	J1772 type 1 connector.
    EV_CONNECTOR_TYPE_TYPE_2: ['TYPE_2'], //	IEC 62196 type 2 connector. Often referred to as MENNEKES.
    EV_CONNECTOR_TYPE_CHADEMO: ['CHADEMO'], //	CHAdeMO type connector.
    EV_CONNECTOR_TYPE_CCS_COMBO_1: ['CCS_1'], //	Combined Charging System (AC and DC). Based on SAE. Type-1 J-1772 connector
    EV_CONNECTOR_TYPE_CCS_COMBO_2: ['CCS_2'], //	Combined Charging System (AC and DC). Based on Type-2 Mennekes connector
    EV_CONNECTOR_TYPE_TESLA: ['TYPE_2'], //	The generic TESLA connector. This is NACS in the North America but can be non-NACS in other parts of the world (e.g. CCS Combo 2 (CCS2) or GB/T). This value is less representative of an actual connector type, and more represents the ability to charge a Tesla brand vehicle at a Tesla owned charging station.
    EV_CONNECTOR_TYPE_UNSPECIFIED_GB_T: ['GB_T_FAST', 'GB_T'], //	GB/T type corresponds to the GB/T standard in China. This type covers all GB_T types.
    EV_CONNECTOR_TYPE_UNSPECIFIED_WALL_OUTLET: ['WALL'], //	Unspecified wall outlet.
  };

  const { setCurrentLocation } = useContext(LocationContext);

  const { radius } = useSelector((state) => state.AppReducer);
  const { isAvailableNow } = useSelector((state) => state.AppReducer);
  const { selectedNetworks } = useSelector((state) => state.AppReducer);
  const { selectedChargingTypes } = useSelector((state) => state.AppReducer);
  const { selectedCharginSpeed } = useSelector((state) => state.AppReducer);
  const { evStations } = useSelector((state) => state.AppReducer);
  const { country } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);
  const { tenant } = useSelector((state) => state.AppReducer);

  const [advertisments, setAdvertisments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemsSelected, setItemSelected] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const mapRef = useRef(null);

  // for location services
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [EVConnectorTypes, setEVConnectorTypes] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    searchText: 'Search',
    reviewsText: 'reviews',
    getDirectionsText: 'Get Direction',
    availableText: 'Available',
    unavailableText: 'Unavailable',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getLanguageData();
  }, []);

  const getLanguageData = async () => {
    let value = await AsyncStorage.getItem('SET_LANGUAGE');
    dispatch({ type: SET_LANGUAGE, payload: value });
    getTranslatedData(value);
  };

  useEffect(() => {
    getTranslatedData(selectedLanguage);
    handleCurrentPress();
  }, [selectedLanguage]);

  useEffect(() => { }, [tenant]);

  useEffect(() => {
    axios
      .get(API_Data.url + 'advertisments', {
        params: {
          pages: 'home',
        },
        headers: API_Data.getHeaders(null, selectedLanguage),
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

  const getTranslatedData = async (language) => {
    if (language == 'en') {
      setTranslateObj(initialTranslateObj);
      setIsTranslatesLoaded(true);
      return;
    }
    try {
      const response = await axios.post(API_Data.url + '/translate', {
        data: translateObj,
        output: language,
      });
      console.log(JSON.stringify(response.data));
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

  useEffect(() => {
    dispatch({ type: KEYBOARD_OPEN, payload: 'show' });
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
      dispatch({ type: KEYBOARD_OPEN, payload: 'hide' });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
      dispatch({ type: KEYBOARD_OPEN, payload: 'show' });
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    // console.log(selectedChargingTypes, 'selectedChargingTypes');
    if (selectedChargingTypes && selectedChargingTypes.length) {
      let selctedEVConnectors = [];
      Object.entries(EVConnectorMapping).map(([key, v]) => {
        for (const selectedChargingType of selectedChargingTypes) {
          if (v.indexOf(selectedChargingType) >= 0) {
            if (selctedEVConnectors.indexOf(key) < 0) {
              selctedEVConnectors.push(key);
            }
          }
        }
      });
      setEVConnectorTypes(selctedEVConnectors);
      if (location) {
        getNearByStations(location.coords.latitude, location.coords.longitude, selctedEVConnectors);
      }
    } else {
      setEVConnectorTypes([]);
      if (location) {
        getNearByStations(location.coords.latitude, location.coords.longitude, []);
      }
    }
  }, [radius, isAvailableNow, selectedNetworks, selectedChargingTypes, selectedCharginSpeed]);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const country = await MapApiFetch.getCountryFromCoordinates(latitude, longitude);
      dispatch({ type: UPDATE_COUNTRY, payload: country });
      setLocation(location);
      setCurrentLocation(location);

      if (location) {
        mapRef?.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
      return location; // Return location for further processing
    } catch (error) {
      setErrorMsg('Error fetching current location');
      console.error('getCurrentLocation Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSelectedLocation = async (location) => {
    setSelectedLocation(location);
    try {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      await getNearByStations(location.latitude, location.longitude, EVConnectorTypes);
    } catch (error) {
      console.error('Error updating selected location:', error);
    }
  };

  const getNearByStations = async (latitude, longitude, selctedEVConnectors) => {
    try {
      dispatch({ type: EV_STATIONS, payload: [] });
      let nextPageToken = null;
      const data = {
        includedTypes: ['electric_vehicle_charging_station'],
        maxResultCount: 20,
        languageCode: selectedLanguage,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            radius: radius,
          },
        },
      };
      // const response = {};
      let response = await MapApiFetch.nearByPlaces(data);

      // if (page_response) {
      //   response.push(...page_response)
        // nextPageToken = response.next_page_token;
        // console.log('nextPageToken', nextPageToken)
        console.log('response', response);
        let filteredPlaces = [];
        if (response.places && response.places.length) {
          for (const place of response.places) {
            if (isAvailableNow) {
              if (place?.currentOpeningHours?.openNow || place?.currentOpeningHours?.openNow) {
                continue;
              }
            }
            let typeFound = false;
            if (selctedEVConnectors && selctedEVConnectors.length) {
              if (place.evChargeOptions) {
                let chargerTypes = place.evChargeOptions?.connectorAggregation.map((x) => x.type);
                console.log('place evCharginOptions');
                if (selctedEVConnectors.some((r) => chargerTypes.includes(r))) {
                  typeFound = true;
                }
              }
            } else {
              console.log('place evCharginOptions 1');
              typeFound = true;
              console.log('place evCharginOptions 2');
            }
            let speedMatch = false;
            if (selectedCharginSpeed && selectedCharginSpeed.length && selctedEVConnectors.length) {
              console.log('place evCharginOptions >>>>>>> 3');
              if (place.evChargeOptions) {
                for (const connectorAggregation of place.evChargeOptions.connectorAggregation) {
                  if (selctedEVConnectors.indexOf(connectorAggregation.type) >= 0) {
                    if (
                      connectorAggregation.maxChargeRateKw >= selectedCharginSpeed[0] &&
                      connectorAggregation.maxChargeRateKw <= selectedCharginSpeed[1]
                    ) {
                      speedMatch = true;
                    } else {
                    }
                  } else {
                  }
                }
              }
            } else if (selectedCharginSpeed) {
              console.log('place evCharginOptions >>>> 4');
              if (place.evChargeOptions) {
                console.log('place evCharginOptions >>>>>> 5');
                if (place.evChargeOptions.connectorAggregation) {
                  for (const connectorAggregation of place?.evChargeOptions?.connectorAggregation) {
                    console.log('place evCharginOptions >>>>>> 6 ' + connectorAggregation);
                    if (
                      connectorAggregation?.maxChargeRateKw >= selectedCharginSpeed[0] &&
                      connectorAggregation?.maxChargeRateKw <= selectedCharginSpeed[1]
                    ) {
                      speedMatch = true;
                    }
                  }
                }
              }
            } else {
              speedMatch = true;
            }
            if (typeFound && speedMatch) {
              console.log('Added');
              filteredPlaces.push(place);
              console.log('Added successfully');
            }
          }
          console.log('santosh');
        }
        console.log(filteredPlaces.length + '-------');
        dispatch({ type: EV_STATIONS, payload: filteredPlaces });
      } catch (error) {
        console.log('Map Api Error ===> ', error);
      }
    };

    const handleCurrentPress = () => {
      getCurrentLocation()
        .then((location) => {
          if (location) {
            return getNearByStations(location.coords.latitude, location.coords.longitude, EVConnectorTypes);
          }
        })
        .catch((error) => {
          console.error('Error fetching current location:', error);
        });
    };

    return (
      <SafeAreaView edges={[]} style={styles.container}>
        {isTranslatesLoaded ? (
          <>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={'google'}
                initialRegion={{
                  latitude: location?.coords?.latitude || 37.7749,
                  longitude: location?.coords?.longitude || -122.4194,
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.0421,
                }}
              >
                {location && (
                  <Marker
                    // image={MY_LOCATION}
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title='Your Location'
                    description='You are here'
                  // style={{ width: 20, height: 20 }}
                  >
                    <Image
                      source={require('../../../../assets/my_location_1.png')}
                      style={Platform.OS == 'android' ? { width: 34, height: 34 } : { width: 34, height: 34 }}
                      resizeMode='contain'
                    />
                  </Marker>
                )}

                {/* Nearby EV Stations */}
                {evStations?.map((item, index) => {
                  return (
                    <TouchableOpacity key={index}>
                      <Marker
                        tracksViewChanges={false}
                        coordinate={{ latitude: item.location.latitude, longitude: item.location.longitude }}
                        onPress={() => {
                          dispatch({ type: HOME_ROUTE, payload: 'hide' });
                          setItemSelected(item);
                          setIsModalVisible(true);
                        }}
                      >
                        <Image
                          source={require('../../../../assets/custom_pin_1.png')}
                          style={Platform.OS == 'android' ? { width: 36, height: 36 } : { width: 36, height: 36 }}
                          resizeMode='contain'
                          onPress={() => {
                            dispatch({ type: HOME_ROUTE, payload: 'hide' });
                            setItemSelected(item);
                            setIsModalVisible(true);
                          }}
                        />
                      </Marker>
                    </TouchableOpacity>
                  );
                })}

                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>

              {/* Search */}
              <View style={styles.header}>
                <GoogleSearchBar
                  placeholder={translateObj.searchText}
                  updateSelectedLocation={updateSelectedLocation}
                  country={country}
                />

                {/* <DrawerButton /> */}
              </View>

              {advertisments && advertisments.length ? (
                <View
                  style={{
                    paddingHorizontal: ThemeConstant.PADDING_MAIN,
                    position: 'absolute',
                    bottom: scale(30),
                    right: scale(0),
                    zIndex: 2,
                    width: '100%',
                  }}
                >
                  <AdvertMulti advertisments={advertisments} showRemove={true} />
                </View>
              ) : null}

              {/* ADVERTISMENT */}
              {tenant && tenant.homeAdd && tenant.homeAdd.url ? (
                <View
                  style={{
                    paddingHorizontal: ThemeConstant.PADDING_MAIN,
                    position: 'absolute',
                    top: Dimensions.get('window').height / 2 - moderateScale(150),
                    right: scale(0),
                    zIndex: 2,
                    width: '100%',
                  }}
                >
                  <Advert url={tenant.homeAdd.url} autoClose={true} />
                </View>
              ) : null}

              {/* ALL Floating Icons */}
              <View
                style={{
                  paddingHorizontal: ThemeConstant.PADDING_MAIN,
                  position: 'absolute',
                  top: scale(150),
                  right: scale(4),
                  gap: scale(10),
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push(Routes.HOME_MAP_FILTER)}
                  activeOpacity={0.6}
                  style={styles.iconContainer}
                >
                  <Image style={styles.icon} source={require('../../../../assets/list-icon.png')} resizeMode='contain' />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push(Routes.HOME_MAP_LIST)}
                  activeOpacity={0.6}
                  style={styles.iconContainer}
                >
                  <Image style={styles.icon} source={require('../../../../assets/filter-icon.png')} resizeMode='contain' />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCurrentPress} activeOpacity={0.6} style={styles.iconContainer}>
                  <Image style={styles.icon} source={require('../../../../assets/gps.png')} resizeMode='contain' />
                </TouchableOpacity>

                {/* <TouchableOpacity activeOpacity={0.6} style={styles.iconContainer}>
            <Image style={styles.icon} source={require('../../../../assets/add-locaion.png')} resizeMode='contain' />
          </TouchableOpacity> */}
              </View>

              {/* <View
          style={{
            paddingHorizontal: ThemeConstant.PADDING_MAIN,
            position: 'absolute',
            bottom: scale(100),
            right: '50%',

          }}
        >
          <TouchableOpacity activeOpacity={0.6} style={styles.iconContainer}>
          <Image source={require('../../../../assets/addIcon.png')} style={styles.icon} resizeMode='cover'/>
          </TouchableOpacity>
          
        </View> */}
              {/* MODAL */}
              <HomeModal
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                item={itemsSelected}
                translateObj={translateObj}
              />
            </KeyboardAvoidingView>
          </>
        ) : (
          <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
            <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
          </View>
        )}
      </SafeAreaView>
    );
  };

  export default Page;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      border: '1px solid red',
    },
    iconContainer: {
      width: scale(40),
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ThemeConstant.PRIMARY_COLOR,
      borderRadius: scale(50),
    },
    icon: {
      width: scale(18),
      height: scale(18),
      tintColor: 'white',
    },
    map: {
      width: '100%',
      height: '100%',
      // border: '1px solid red',
    },
    addIcon: {
      width: scale(32),
      height: scale(32),
    },

    //
    header: {
      paddingHorizontal: ThemeConstant.PADDING_MAIN,
      position: 'absolute',
      top: scale(50),
      right: scale(0),
      zIndex: 2,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(20),
      alignItems: 'flex-start',
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
