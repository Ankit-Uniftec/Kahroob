import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../constants/ThemeConstant';

const Itemcard = ({ item, handleNavigate, handleFavorite }) => {
    const [bookmarked, setBookmarked] = useState(false)

    const PHOTO_BASE_URL = 'https://places.googleapis.com/v1/';
    // const API_KEY = 'AIzaSyCKFKjyPUloNMA_aF0UN6n5kdUIUAjNK-0'
    const API_KEY = 'AIzaSyBbrdDseUJ1KBfawyv75WvES521hKJgo78'

    let imageUrl = item?.photos?.length ? `${PHOTO_BASE_URL}${item?.photos[0]?.name}/media?key=${API_KEY}&maxHeightPx=800&maxWidthPx=1200`
        : 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym13JTIwY2FyfGVufDB8fDB8fHww'
    return (
        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.8} style={styles.cardContainer}>
            <Image style={styles.img} resizeMode='cover' source={{ uri: imageUrl }} />

            <View style={styles.detailContainer}>
                {/* <Text style={{ fontWeight: '700', fontSize: scale(8) }}>Vehicles</Text> */}
                <Text style={{ fontWeight: '700', fontSize: scale(16), color: ThemeConstant.PRIMARY_COLOR }}>{item?.displayName?.text}</Text>
                {/* <Text style={{ fontWeight: '700', fontSize: scale(14), color: '#000' }}>BMW • X1</Text> */}
                <Text numberOfLines={2} style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617' }}>{item?.formattedAddress}</Text>
                {/* <Text style={{ fontWeight: '400', fontSize: scale(8), color: '#000', opacity: .5 }}>2016 • 1000 km</Text> */}
            </View>

            <TouchableOpacity onPress={handleFavorite} activeOpacity={0.7} style={styles.iconContainer}>
                <FontAwesome name={!bookmarked ? "bookmark" : "bookmark-o"} size={24} color={ThemeConstant.PRIMARY_COLOR} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default Itemcard

const styles = StyleSheet.create({
    cardContainer: {
        height: moderateVerticalScale(109),
        backgroundColor: '#fff',
        padding: scale(8),
        position: 'relative',
        flexDirection: 'row',
        borderRadius: scale(10),
        gap: moderateScale(8),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    img: {
        width: moderateScale(120),
        borderRadius: scale(10),
        resizeMode: 'cover'
    },
    detailContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "space-around"

    },
    iconContainer: {
        position: 'absolute',
        top: scale(10),
        right: scale(15)
    }
})