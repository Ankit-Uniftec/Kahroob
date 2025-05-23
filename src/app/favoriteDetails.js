import { StyleSheet, Text, View, useWindowDimensions, Image, ScrollView, TouchableOpacity, FlatList, Linking, Platform, Share } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import BackButton from '../components/BackButton';
import { Entypo } from '@expo/vector-icons';
import ThemeConstant from '../constants/ThemeConstant';
import { moderateVerticalScale, scale, moderateScale } from 'react-native-size-matters';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';
import Line from '../components/profile/line';
import MapView, { Marker } from 'react-native-maps';
import CustomButton from '../components/CustomButton';
import AddReviewModal from '../components/home/AddReviewModal';
import { LocationContext } from '../context/location';
import PIN from '../../assets/custom_pin.png'

import { useDispatch, useSelector } from 'react-redux';
import { REMOVE_FAVORITE, UPDATE_FAVORITE } from '../store/allactionsTypes';

const StationDetail = ({ item }) => {
    const dispatch = useDispatch();
    const { EVStation, calculation } = useContext(LocationContext)

    const { user, allFavorites } = useSelector(state => state.AuthReducer)

    const { width } = useWindowDimensions();
    const [timingsShowing, setTimingShowing] = useState(true);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);

    let find = allFavorites.some(f => f.displayName?.text == EVStation?.displayName?.text && f.userId == user?.uid)

    const openGoogleMaps = () => {
        const { latitude, longitude } = EVStation.location;
        const url = Platform.select({
            ios: `maps:${latitude},${longitude}?q=${EVStation?.formattedAddress}`,
            android: `geo:${latitude},${longitude}?q=${EVStation?.formattedAddress}`,
        });

        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };

    const handleFavorite = async () => {
        if (find) {
            removeFavorite(user.uid, EVStation?.displayName?.text)
        } else {
            addToFavorites(user.uid, { ...EVStation, userId: user.uid });
        }
    };

    const addToFavorites = (userId, stationDetail) => {
        dispatch({ type: UPDATE_FAVORITE, payload: stationDetail })
    };

    const removeFavorite = (userId, name) => {
        dispatch({ type: REMOVE_FAVORITE, payload: { userId, name } })
    };

    const handleShare = async () => {
        const { latitude, longitude } = EVStation.location;
        const mapUrl = Platform.select({
            ios: `maps://?q=${latitude},${longitude}`,
            android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        });

        try {
            const result = await Share.share({
                message: `Check out this EV station: ${EVStation.displayName.text}, located at ${EVStation.formattedAddress}. ${mapUrl}`,
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
            {/* Carousel */}
            <View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'absolute',
                    width: '100%',
                    paddingHorizontal: ThemeConstant.PADDING_MAIN,
                    zIndex: 2,
                    top: moderateVerticalScale(10)
                }}>
                    <BackButton />
                    <Entypo name="dots-three-vertical" size={24} color="black" />
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
                            // const API_KEY = 'AIzaSyCKFKjyPUloNMA_aF0UN6n5kdUIUAjNK-0'
                            const API_KEY = 'AIzaSyBbrdDseUJ1KBfawyv75WvES521hKJgo78';

                            let imageUrl = `${PHOTO_BASE_URL}${item.name}/media?key=${API_KEY}&maxHeightPx=800&maxWidthPx=1200`

                            return (
                                <View style={{ flex: 1 }}>
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={{ flex: 1, resizeMode: 'cover' }}
                                    />
                                </View>
                            );
                        }}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: ThemeConstant.PADDING_MAIN, paddingBottom: moderateVerticalScale(20), gap: scale(20) }}>
                {/* STATION DETAILS */}
                <View style={{ flexDirection: 'row', justifyContent: "space-between", }}>
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
                                    <AntDesign key={index} name="star" size={15} color="#FFB800" />
                                ))}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                            <View style={{
                                backgroundColor: EVStation?.currentOpeningHours?.openNow ? ThemeConstant.PRIMARY_COLOR : "gray",
                                borderRadius: scale(5),
                                paddingHorizontal: moderateScale(10),
                                paddingVertical: moderateVerticalScale(8)
                            }}>
                                <Text style={{ fontWeight: '700', fontSize: scale(8), color: '#fff' }}>{EVStation?.currentOpeningHours?.openNow ? "Available" : "Unavailable"}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(2) }}>
                                <Entypo name="location-pin" size={20} color={ThemeConstant.FADED_BLACK} />
                                <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>{calculation?.distance}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(5) }}>
                                <AntDesign name="car" size={20} color={ThemeConstant.FADED_BLACK} />
                                <Text style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617', opacity: 0.5 }}>{calculation?.duration}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: scale(30) }}>
                        <AntDesign onPress={handleShare} name="sharealt" size={24} color="black" />
                        <FontAwesome onPress={handleFavorite} name={find ? "bookmark" : "bookmark-o"} size={24} color={!find ? '#000' : '#00CC44'} />
                    </View>
                </View>

                <Line />

                {/* BUTTONS */}
                <View style={{ gap: scale(8), flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <CustomButton title={"Add Review"} type='outline' onPress={() => setReviewModalVisible(true)} />
                    </View>
                    <View style={{ width: '50%' }}>
                        <CustomButton onPress={openGoogleMaps} title={"Get Direction"} />
                    </View>
                </View>

                <Line />

                {/* ABOUT */}
                <View style={{ gap: scale(10) }}>
                    <Text style={{ fontWeight: '700', fontSize: scale(15) }}>About</Text>
                    <View style={{
                        gap: scale(20)
                    }}>
                        <Text style={{ fontWeight: '400', fontSize: scale(12), lineHeight: scale(18) }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum debitis aut explicabo voluptates dicta iusto velit, repellat odit unde minima non optio officiis, reiciendis sit recusandae reprehenderit dolores esse? Ab.</Text>
                        <Line />
                    </View>
                </View>

                <Line />

                {/* TIMINGS */}
                <View style={{
                    borderWidth: 1,
                    borderColor: '#d4d4d4',
                    padding: scale(10),
                    borderRadius: scale(5),
                    gap: scale(10)

                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: '700', fontSize: scale(12), color: ThemeConstant.PRIMARY_COLOR }}>Open</Text>
                            <Text style={{ fontWeight: '700', fontSize: scale(12) }}> - Timings</Text>

                        </View>
                        <TouchableOpacity onPress={() => setTimingShowing(!timingsShowing)}>
                            <Entypo name={timingsShowing ? "chevron-small-up" : "chevron-small-down"} size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {timingsShowing && <Line />}

                    {timingsShowing && <View style={{ gap: scale(10) }}>
                        {EVStation?.currentOpeningHours?.weekdayDescriptions?.map((description, index) => {
                            const [day, timingRange] = description.split(': ');

                            return (
                                <View key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                    <Text style={{ fontWeight: '400', fontSize: scale(12) }}>{day}</Text>
                                    <Text style={{ fontWeight: '700', fontSize: scale(10), fontStyle: 'italic' }}>{timingRange}</Text>
                                </View>
                            )
                        })
                        }
                    </View>}
                </View>

                {/* Report Station */}
                <TouchableOpacity activeOpacity={0.8}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: scale(5),
                    }}>
                    <Feather name="alert-triangle" size={20} color="red" />
                    <Text style={{ color: 'red' }}>Report Station</Text>
                </TouchableOpacity>

                {/* MAP */}
                <View style={{ gap: scale(10) }}>
                    <Text style={{ fontWeight: '700', fontSize: scale(15) }}>Location</Text>
                    <View style={{ height: scale(200) }}>
                        <MapView style={styles.map} provider='google'
                            initialRegion={{
                                latitude: EVStation?.location?.latitude,
                                longitude: EVStation?.location?.longitude,
                                latitudeDelta: 0.0422,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <Marker
                                image={PIN}
                                coordinate={{ latitude: EVStation?.location?.latitude, longitude: EVStation?.location?.longitude }}
                            />
                        </MapView>
                    </View>
                </View>
            </ScrollView>
            <AddReviewModal isVisible={reviewModalVisible} setIsVisible={setReviewModalVisible} />
        </SafeAreaView>
    )
}

export default StationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: scale(20),
        position: 'relative',
        backgroundColor: '#fff'
    }, map: {
        width: '100%',
        height: '100%',
    },
})