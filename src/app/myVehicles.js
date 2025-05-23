import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import { router } from 'expo-router';

import ThemeConstant from '../constants/ThemeConstant';
import SearchBar from '../components/SearchBar';
import Routes from '../constants/Routes';
import Header from '../components/Header'
import useThemeConstants from '../hooks/useThemeConstants';

let data = [
    {
        id: 1,
        manufacture: 'Tesla',
        model: 'Model Y',
        year: 2024,
        image: require('../../assets/car.png')
    },
    {
        id: 2,
        manufacture: 'Audi',
        model: 'e-tron',
        year: 2023,
        image: require('../../assets/car_2.png')
    },
    {
        id: 3,
        manufacture: 'Audi',
        model: 'RS e-tron GT',
        year: 2024,
    }
]

const MyVehicles = () => {
    const themeConstant = useThemeConstants();

    const [searchValue, setSearchValue] = useState('');
    const [filterData, setFilteredData] = useState(data);

    const renderItem = useCallback(({ item }) => {
        let imageUrl = 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym13JTIwY2FyfGVufDB8fDB8fHww'

        return (
            <TouchableOpacity onPress={() => router.push(Routes.CLASSIFIED_DETAIL)} activeOpacity={0.8} style={styles.cardContainer}>
                <Image style={styles.img} resizeMode='cover' source={item?.image ? item?.image : { uri: imageUrl }} />

                <View style={styles.detailContainer}>
                    <View flex={1} style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontWeight: '600', fontSize: scale(16), color: ThemeConstant.BLACK }}>{item?.manufacture}</Text>
                            <View style={styles.circle} />
                            <Text style={{ fontWeight: '600', fontSize: scale(16), color: ThemeConstant.BLACK }}>{item?.model}</Text>
                        </View>
                        <View style={{ gap: 4 }}>
                            <Text style={{ fontWeight: '700', fontSize: scale(8), color: themeConstant.FADED_BLACK }}>Year</Text>
                            <Text style={{ fontWeight: '700', fontSize: scale(14), color: ThemeConstant.BLACK }}>{item.year}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }, [])

    const handleSearch = (text) => {
        setSearchValue(text);
        if (text?.trim() === '') {
            setFilteredData(data);
        } else {
            const filteredFavorites = data.filter(item =>
                item?.manufacture?.toLowerCase().includes(text?.toLowerCase()) ||
                item?.model?.toLowerCase().includes(text?.toLowerCase()) ||
                item?.year?.toString()?.includes(text?.toLowerCase())
            );
            setFilteredData(filteredFavorites);
        }
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
            {/* Header */}
            <Header title='My Reviews' />

            <View style={{ flex: 1, marginTop: 14, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
                <SearchBar placeholder={"Search"} value={searchValue} setValue={handleSearch} />

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
        </SafeAreaView>
    )
}

export default MyVehicles

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: moderateVerticalScale(10),
        position: 'relative'
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
        width: scale(100),
        height: scale(100),
        borderRadius: scale(10),
        resizeMode: 'cover'
    },
    detailContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    circle: {
        width: scale(10),
        borderRadius: 25,
        backgroundColor: '#000',
        aspectRatio: 1 / 1,
    }
})