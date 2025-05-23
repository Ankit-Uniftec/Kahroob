// DrawerModal.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Platform, Linking, Share } from 'react-native';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import { Entypo, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
// import openMap from 'react-native-open-maps';

import ThemeConstant from '../../constants/ThemeConstant';
import Routes from '../../constants/Routes';
import { LocationContext } from '../../context/location';
import MapApiFetch from '../../utils/MapApiFetch';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_STATIONS, HOME_ROUTE } from '../../store/allactionsTypes';


const HomeModal = ({ isVisible, setIsVisible, item, translateObj }) => {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const { setEVStation, currentLocation, calculation, setCalculation } = useContext(LocationContext);

  const { user } = useSelector((state) => state.AuthReducer);
  const { chargingStations } = useSelector((state) => state.ThemeReducer);

  let findIndex = chargingStations.findIndex((f) => f.userId === user?.id && f.id == item.id);

  const openGoogleMaps = () => {
    const { latitude, longitude } = item.location;
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${item?.formattedAddress}`,
      android: `geo:${latitude},${longitude}?q=${item?.formattedAddress}`,
    });

    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  // const openGoogleMaps = () => {
  //     const { latitude, longitude } = item.location;
  //     openMap({ latitude, longitude });
  // };

  const getVehicleType = (code) => {
    let name = 'Other';
    switch (code) {
      case 'EV_CONNECTOR_TYPE_OTHER':
        name = 'Other';
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

  // const handlePress = (selectedItem) => {
  //   if (selectedItem === item) {
  //     setIsVisible(false);
  //     setSelectedItem(null);
  //   } else {
  //   dispatch({ type: HOME_ROUTE, payload: 'show' });
  //   setIsVisible(true);
  //   setSelectedItem(item);
  //   router.push({ pathname: `${Routes.HOME_STATION_DETAIL}` });
  //   }
  // };

  const calculateDistanceAndDuration = useCallback(async () => {
    if (isVisible) {
      const { latitude, longitude } = item.location;
      try {
        const response = await MapApiFetch.getDistanceAndDuration(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          latitude,
          longitude
        );
        setCalculation(response);
      } catch (error) {
        console.error('Error calculating distance and duration:', error);
      }
    }
  }, [isVisible]);

  useEffect(() => {
    calculateDistanceAndDuration();
  }, [calculateDistanceAndDuration]);

  const handleShare = async () => {
    const { latitude, longitude } = item.location;
    const mapUrl = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`,
      android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    try {
      const result = await Share.share({
        message: `Check out this EV station: ${item.displayName.text}, located at ${item.formattedAddress}. ${mapUrl}`,
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
  
  const handlePress = () => {
    dispatch({ type: HOME_ROUTE, payload: 'show' });
    setIsVisible(false);
    setEVStation(item);
    router.push({ pathname: `${Routes.HOME_STATION_DETAIL}` });
  };

  const handleFavorite = async () => {
    if (findIndex !== -1) {
      let updatedStations = [...chargingStations];
      updatedStations.splice(findIndex, 1);
      dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
    } else {
      let updatedStations = [...chargingStations, { userId: user?.id, ...item }];
      dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
    }
  };

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setIsVisible(false);
          dispatch({ type: HOME_ROUTE, payload: 'show' });
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setIsVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => { }}
            style={styles.drawerContent1}
          >
            {/* Modal content */}
            <TouchableOpacity activeOpacity={0.9} onPress={handlePress}
            >
              <View style={styles.drawerContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ gap: scale(10) }}>
                    {/* AED ${item.price}/kwh */}
                    <Text style={{ fontWeight: '700', fontSize: scale(12) }}>{``}</Text>
                    <Text style={{ fontWeight: '700', fontSize: scale(16) }}>{item?.displayName?.text}</Text>
                    <Text style={{ fontWeight: '400', fontSize: scale(10) }}>{item?.formattedAddress}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsVisible(false)}
                    style={{ position: 'absolute', top: scale(0), right: scale(0), borderWidth: 1.5, borderColor: '#b6b6b6', height: scale(24), borderRadius: 5 }}
                  >
                    <Entypo name='cross' size={26} color='black' />
                  </TouchableOpacity>
                </View>

                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                    <Text style={{ fontWeight: '700', fontSize: scale(8) }}>{item?.rating?.toFixed(1)}</Text>
                    <View style={{ flexDirection: 'row', gap: scale(2) }}>
                      {/* EVStation.rating */}
                      {Array.from({ length: item.rating }, (_, index) => (
                        <AntDesign key={index} name='star' size={15} color='#FFB800' />
                      ))}
                    </View>

                    <Text style={{ fontWeight: '400', fontSize: scale(8), color: ThemeConstant.FADED_BLACK }}>
                      ({item?.userRatingCount} {translateObj.reviewsText})
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                  <View
                    style={{
                      backgroundColor: item?.currentOpeningHours?.openNow ? ThemeConstant.PRIMARY_COLOR : 'gray',
                      borderRadius: scale(5),
                      paddingHorizontal: moderateScale(10),
                      paddingVertical: moderateVerticalScale(8),
                    }}
                  >
                    <Text style={{ fontWeight: '700', fontSize: scale(8), color: '#fff' }}>
                      {item?.currentOpeningHours?.openNow ? translateObj.availableText : translateObj.unavailableText}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(2) }}>
                    <Entypo name='location-pin' size={20} color={ThemeConstant.FADED_BLACK} />
                    {calculation && calculation.distance && (
                      <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>
                        {calculation.distance}
                      </Text>
                    )}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(5) }}>
                    <AntDesign name='car' size={20} color={ThemeConstant.FADED_BLACK} />
                    {calculation && calculation.duration && (
                      <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>
                        {calculation.duration}
                      </Text>
                    )}
                  </View>
                </View>

                {item.evChargeOptions &&
                  item.evChargeOptions.connectorAggregation &&
                  item.evChargeOptions.connectorAggregation.map((aggregation, index) => (
                    <View key={index} style={{ flexDirection: 'row', gap: scale(2), alignItems: 'center' }}>
                      <MaterialCommunityIcons name={getVehicleIcon(aggregation?.type)} size={24} color='black' />
                      <Text style={{ fontWeight: '400', fontSize: scale(10) }}>{getVehicleType(aggregation.type)}</Text>
                      <Text style={{ fontWeight: '700', fontSize: scale(14) }}>•</Text>
                      <Text style={{ fontWeight: '400', fontSize: scale(10) }}>
                        {aggregation.count} {aggregation.count > 1 ? 'Plugs ' : 'Plug '}
                      </Text>
                      {aggregation.maxChargeRateKw ? (
                        <>
                          <Text style={{ fontWeight: '700', fontSize: scale(14) }}>•</Text>
                          <Text style={{ fontWeight: '400', fontSize: scale(10) }}>
                            {Number(aggregation.maxChargeRateKw).toFixed(0)} KW
                          </Text>
                        </>
                      ) : null}
                    </View>
                  ))}

                <View
                  style={{
                    flexDirection: 'row',
                    gap: scale(10),
                  }}
                >
                  <TouchableOpacity
                    onPress={handleShare}
                    activeOpacity={0.7}
                    style={{
                      width: scale(40),
                      aspectRatio: 1 / 1,
                      borderWidth: scale(1.4),
                      borderColor: ThemeConstant.PRIMARY_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: scale(50),
                      zIndex: 1,
                    }}
                  >
                    <Entypo name='share' size={24} color={ThemeConstant.PRIMARY_COLOR} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFavorite}
                    activeOpacity={0.7}
                    style={{
                      width: scale(40),
                      aspectRatio: 1 / 1,
                      borderWidth: scale(1.4),
                      borderColor: ThemeConstant.PRIMARY_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: scale(50),
                      zIndex: 1,
                    }}
                  >
                    <FontAwesome name={findIndex !== -1 ? 'bookmark' : 'bookmark-o'} size={24} color='#00CC44' />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openGoogleMaps}
                    style={{
                      backgroundColor: ThemeConstant.PRIMARY_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: scale(100),
                      paddingHorizontal: scale(20),
                      zIndex: 1,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: scale(12) }}>
                      {translateObj.getDirectionsText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: moderateVerticalScale(100),
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  drawerContent1: {
    width: '100%',
    backgroundColor: "transparent",
    gap: scale(15),
    padding: ThemeConstant.PADDING_MAIN,
  },
  drawerContent: {
    width: '100%',
    backgroundColor: '#fff',
    gap: scale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    borderRadius: scale(10),
    padding: ThemeConstant.PADDING_MAIN,
  },
});

export default HomeModal;


// import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
// import { Modal, View, StyleSheet, TouchableOpacity, Text, Platform, Linking, Share } from 'react-native';
// import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
// import { Entypo, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import MapView, { Marker } from 'react-native-maps';

// import ThemeConstant from '../../constants/ThemeConstant';
// import Routes from '../../constants/Routes';
// import { LocationContext } from '../../context/location';
// import MapApiFetch from '../../utils/MapApiFetch';
// import { useDispatch, useSelector } from 'react-redux';
// import { BOOKMARK_STATIONS, HOME_ROUTE } from '../../store/allactionsTypes';

// const HomeModal = ({ isVisible, setIsVisible, item, translateObj }) => {
//   const dispatch = useDispatch();
//   const [selectedItem, setSelectedItem] = useState(null);
//   const mapRef = useRef(null);

//   const { setEVStation, currentLocation, calculation, setCalculation } = useContext(LocationContext);

//   const { user } = useSelector((state) => state.AuthReducer);
//   const { chargingStations } = useSelector((state) => state.ThemeReducer);

//   let findIndex = chargingStations.findIndex((f) => f.userId === user?.id && f.id == item.id);

//   useEffect(() => {
//     if (isVisible && mapRef.current && item.location) {
//       mapRef.current.animateToRegion({
//         latitude: item.location.latitude,
//         longitude: item.location.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       });
//     }
//   }, [isVisible, item]);

//   const openGoogleMaps = () => {
//     const { latitude, longitude } = item.location;
//     const url = Platform.select({
//       ios: `maps:${latitude},${longitude}?q=${item?.formattedAddress}`,
//       android: `geo:${latitude},${longitude}?q=${item?.formattedAddress}`,
//     });

//     Linking.openURL(url).catch((err) => console.error('An error occurred', err));
//   };

//   const getVehicleType = (code) => {
//     let name = 'Other';
//     switch (code) {
//       case 'EV_CONNECTOR_TYPE_OTHER':
//         name = 'Other';
//         break;
//       case 'EV_CONNECTOR_TYPE_J1772':
//         name = 'J-1772';
//         break;
//       case 'EV_CONNECTOR_TYPE_TYPE_2':
//         name = 'Type 2';
//         break;
//       case 'EV_CONNECTOR_TYPE_CHADEMO':
//         name = 'CHAdeMO';
//         break;
//       case 'EV_CONNECTOR_TYPE_TESLA':
//         name = 'Type 2';
//         break;
//       case 'EV_CONNECTOR_TYPE_UNSPECIFIED_GB_T':
//         name = 'GB/T';
//         break;
//       case 'EV_CONNECTOR_TYPE_UNSPECIFIED_WALL_OUTLET':
//         name = 'Wall';
//         break;
//       case 'EV_CONNECTOR_TYPE_CCS_COMBO_1':
//         name = 'CCS/SAE';
//         break;
//       case 'EV_CONNECTOR_TYPE_CCS_COMBO_2':
//         name = 'CCS/Mennekes';
//         break;
//       default:
//         name = 'Other';
//     }
//     return name;
//   };

//   const getVehicleIcon = (code) => {
//     let name = 'Other';
//     switch (code) {
//       case 'EV_CONNECTOR_TYPE_OTHER':
//         name = 'power-plug';
//         break;
//       case 'EV_CONNECTOR_TYPE_J1772':
//         name = 'ev-plug-type1';
//         break;
//       case 'EV_CONNECTOR_TYPE_TYPE_2':
//         name = 'ev-plug-type2';
//         break;
//       case 'EV_CONNECTOR_TYPE_CHADEMO':
//         name = 'ev-plug-chademo';
//         break;
//       case 'EV_CONNECTOR_TYPE_TESLA':
//         name = 'ev-plug-tesla';
//         break;
//       case 'EV_CONNECTOR_TYPE_UNSPECIFIED_GB_T':
//         name = 'power-plug';
//         break;
//       case 'EV_CONNECTOR_TYPE_UNSPECIFIED_WALL_OUTLET':
//         name = 'power-socket';
//         break;
//       case 'EV_CONNECTOR_TYPE_CCS_COMBO_1':
//         name = 'ev-plug-ccs1';
//         break;
//       case 'EV_CONNECTOR_TYPE_CCS_COMBO_2':
//         name = 'ev-plug-ccs2';
//         break;
//       default:
//         name = 'power-plug';
//     }
//     return name;
//   };

//   const handlePress = (selectedItem) => {
//     if (selectedItem === item) {
//       setIsVisible(false);
//       setSelectedItem(null);
//     } else {
//       dispatch({ type: HOME_ROUTE, payload: 'show' });
//       setIsVisible(true);
//       setSelectedItem(item);
//       router.push({ pathname: `${Routes.HOME_STATION_DETAIL}` });
//     }
//   };

//   const calculateDistanceAndDuration = useCallback(async () => {
//     if (isVisible) {
//       const { latitude, longitude } = item.location;
//       try {
//         const response = await MapApiFetch.getDistanceAndDuration(
//           currentLocation.coords.latitude,
//           currentLocation.coords.longitude,
//           latitude,
//           longitude
//         );
//         setCalculation(response);
//       } catch (error) {
//         console.error('Error calculating distance and duration:', error);
//       }
//     }
//   }, [isVisible]);

//   useEffect(() => {
//     calculateDistanceAndDuration();
//   }, [calculateDistanceAndDuration]);

//   const handleShare = async () => {
//     const { latitude, longitude } = item.location;
//     const mapUrl = Platform.select({
//       ios: `maps://?q=${latitude},${longitude}`,
//       android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
//     });

//     try {
//       const result = await Share.share({
//         message: `Check out this EV station: ${item.displayName.text}, located at ${item.formattedAddress}. ${mapUrl}`,
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           // shared with activity type of result.activityType
//         } else {
//           // shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // dismissed
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleFavorite = async () => {
//     if (findIndex !== -1) {
//       let updatedStations = [...chargingStations];
//       updatedStations.splice(findIndex, 1);
//       dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
//     } else {
//       let updatedStations = [...chargingStations, { userId: user?.id, ...item }];
//       dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
//     }
//   };

//   return (
//     <Modal
//       visible={isVisible}
//       animationType="fade"
//       transparent={true}
//       onRequestClose={() => {
//         setIsVisible(false);
//         dispatch({ type: HOME_ROUTE, payload: 'show' });
//       }}
//     >
//       <View style={[styles.modalContainer, { borderWidth: 1, borderColor: 'black' }]}>
//         <View style={styles.drawerContent}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <View style={{ gap: scale(10) }}>
//               <Text style={{ fontWeight: '700', fontSize: scale(12) }}>{``}</Text>
//               <Text style={{ fontWeight: '700', fontSize: scale(16) }}>{item?.displayName?.text}</Text>
//               <Text style={{ fontWeight: '400', fontSize: scale(10) }}>{item?.formattedAddress}</Text>
//             </View>
//             <TouchableOpacity
//               onPress={() => setIsVisible(false)}
//               style={{ position: 'absolute', top: scale(10), right: scale(10), borderWidth: 1.5, borderColor: '#b6b6b6', height: scale(24), borderRadius: 5 }}
//             >
//               <Entypo name='cross' size={26} color='black' />
//             </TouchableOpacity>
//           </View>

//           <MapView
//             ref={mapRef}
//             style={{ width: '100%', height: 200, marginVertical: scale(10) }}
//             initialRegion={{
//               latitude: item.location?.latitude || 0,
//               longitude: item.location?.longitude || 0,
//               latitudeDelta: 0.005,
//               longitudeDelta: 0.005,
//             }}
//           >
//             {item.location && (
//               <Marker
//                 coordinate={{
//                   latitude: item.location.latitude,
//                   longitude: item.location.longitude,
//                 }}
//                 title={item.displayName?.text}
//               />
//             )}
//           </MapView>

//           <View>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
//               <Text style={{ fontWeight: '700', fontSize: scale(8) }}>{item?.rating?.toFixed(1)}</Text>
//               <View style={{ flexDirection: 'row', gap: scale(2) }}>
//                 {Array.from({ length: item.rating }, (_, index) => (
//                   <AntDesign key={index} name='star' size={15} color='#FFB800' />
//                 ))}
//               </View>
//               <Text style={{ fontWeight: '400', fontSize: scale(8), color: ThemeConstant.FADED_BLACK }}>
//                 ({item?.userRatingCount} {translateObj.reviewsText})
//               </Text>
//             </View>
//           </View>

//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
//             <View
//               style={{
//                 backgroundColor: item?.currentOpeningHours?.openNow ? ThemeConstant.PRIMARY_COLOR : 'gray',
//                 borderRadius: scale(5),
//                 paddingHorizontal: moderateScale(10),
//                 paddingVertical: moderateVerticalScale(8),
//               }}
//             >
//               <Text style={{ fontWeight: '700', fontSize: scale(8), color: '#fff' }}>
//                 {item?.currentOpeningHours?.openNow ? translateObj.availableText : translateObj.unavailableText}
//               </Text>
//             </View>

//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(2) }}>
//               <Entypo name='location-pin' size={20} color={ThemeConstant.FADED_BLACK} />
//               {calculation && calculation.distance && (
//                 <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>
//                   {calculation.distance}
//                 </Text>
//               )}
//             </View>

//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(5) }}>
//               <AntDesign name='car' size={20} color={ThemeConstant.FADED_BLACK} />
//               {calculation && calculation.duration && (
//                 <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>
//                   {calculation.duration}
//                 </Text>
//               )}
//             </View>
//           </View>

//           {item.evChargeOptions &&
//             item.evChargeOptions.connectorAggregation &&
//             item.evChargeOptions.connectorAggregation.map((aggregation, index) => (
//               <View key={index} style={{ flexDirection: 'row', gap: scale(2), alignItems: 'center' }}>
//                 <MaterialCommunityIcons name={getVehicleIcon(aggregation?.type)} size={24} color='black' />
//                 <Text style={{ fontWeight: '400', fontSize: scale(10) }}>{getVehicleType(aggregation.type)}</Text>
//                 <Text style={{ fontWeight: '700', fontSize: scale(14) }}>•</Text>
//                 <Text style={{ fontWeight: '400', fontSize: scale(10) }}>
//                   {aggregation.count} {aggregation.count > 1 ? 'Plugs ' : 'Plug '}
//                 </Text>
//                 {aggregation.maxChargeRateKw ? (
//                   <>
//                     <Text style={{ fontWeight: '700', fontSize: scale(14) }}>•</Text>
//                     <Text style={{ fontWeight: '400', fontSize: scale(10) }}>
//                       {Number(aggregation.maxChargeRateKw).toFixed(0)} KW
//                     </Text>
//                   </>
//                 ) : null}
//               </View>
//             ))}

//           <View
//             style={{
//               flexDirection: 'row',
//               gap: scale(10),
//             }}
//           >
//             <TouchableOpacity
//               onPress={handleShare}
//               activeOpacity={0.7}
//               style={{
//                 width: scale(40),
//                 aspectRatio: 1 / 1,
//                 borderWidth: scale(1.4),
//                 borderColor: ThemeConstant.PRIMARY_COLOR,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: scale(50),
//                 zIndex: 1,
//               }}
//             >
//               <Entypo name='share' size={24} color={ThemeConstant.PRIMARY_COLOR} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={handleFavorite}
//               activeOpacity={0.7}
//               style={{
//                 width: scale(40),
//                 aspectRatio: 1 / 1,
//                 borderWidth: scale(1.4),
//                 borderColor: ThemeConstant.PRIMARY_COLOR,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: scale(50),
//                 zIndex: 1,
//               }}
//             >
//               <FontAwesome name={findIndex !== -1 ? 'bookmark' : 'bookmark-o'} size={24} color='#00CC44' />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={openGoogleMaps}
//               style={{
//                 backgroundColor: ThemeConstant.PRIMARY_COLOR,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: scale(100),
//                 paddingHorizontal: scale(20),
//                 zIndex: 1,
//               }}
//             >
//               <Text style={{ color: '#fff', fontWeight: '700', fontSize: scale(12) }}>
//                 {translateObj.getDirectionsText}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     paddingBottom: moderateVerticalScale(100),
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//   },
//   drawerContent: {
//     width: '95%', // Increased width to accommodate the map
//     backgroundColor: '#fff',
//     gap: scale(15),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.34,
//     shadowRadius: 6.27,
//     elevation: 10,
//     borderRadius: scale(10),
//     padding: ThemeConstant.PADDING_MAIN,
//   },
// });

// export default HomeModal;