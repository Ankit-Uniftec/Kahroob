import React, { useCallback, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons';

import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters'
import useThemeConstants from '../../hooks/useThemeConstants'
import ThemeConstant from '../../constants/ThemeConstant'
import { BOOKMARK_CLASSIFIED } from '../../store/allactionsTypes'

const BookmarkAdds = () => {
    const dispatch = useDispatch();
    const themeConstant = useThemeConstants();
    const { user } = useSelector(state => state.AuthReducer)

    const { classifields } = useSelector(state => state.ThemeReducer)

    let findIndex = classifields.findIndex(f => f.userId === user?.uid);
    const [isFavorite, setIsFavorite] = useState(findIndex !== -1);

    const handleFavorite = async () => {
        if (findIndex !== -1) {
            let updatedClassifieds = [...classifields];
            updatedClassifieds.splice(findIndex, 1);
            dispatch({ type: BOOKMARK_CLASSIFIED, payload: updatedClassifieds });
            setIsFavorite(false);
        } else {
            let updatedClassifieds = [
                ...classifields,
                { userId: user?.uid }
            ];
            dispatch({ type: BOOKMARK_CLASSIFIED, payload: updatedClassifieds });
            setIsFavorite(true);
        }
    };

    const renderItem = useCallback(() => {
        return (
            <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
                <Image style={styles.img} resizeMode='cover' source={require('../../../assets/car.png')} />

                <View style={styles.detailContainer}>
                    <Text style={{ fontWeight: '700', fontSize: scale(16), color: ThemeConstant.PRIMARY_COLOR }}>AED 10,000</Text>
                    <Text style={{ fontWeight: '700', fontSize: scale(14), color: '#000' }}>BMW • X1</Text>
                    <Text numberOfLines={2} style={{ fontWeight: '400', fontSize: scale(10), color: '#0E1617' }}>Explore in-depth product details....</Text>
                </View>

                <TouchableOpacity activeOpacity={0.7} style={styles.iconContainer} onPress={handleFavorite}>
                    <FontAwesome name={isFavorite ? "bookmark" : "bookmark-o"} size={24} color={!isFavorite ? '#000' : '#00CC44'} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }, [classifields])

    return (
        <FlatList
            data={classifields.filter(f => f.userId === user?.uid)}
            renderItem={renderItem}
            keyExtractor={(_, index) => `adds-${index}`}
            ListEmptyComponent={() => <Text style={[styles.txt, { color: themeConstant.TEXT_PRIMARY }]}>No bookmarks ads to show.</Text>}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListHeaderComponent={() => <View style={{ height: scale(20) }} />}
            ListFooterComponent={() => <View style={{ height: scale(20) }} />}
        />
    )
}

export default BookmarkAdds

const styles = StyleSheet.create({
    txt: {
        fontSize: scale(16),
        marginTop: 16,
        textAlign: 'center'
    },

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
        height: moderateScale(100),
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