import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ThemeConstant from '../constants/ThemeConstant'
import { moderateVerticalScale, scale } from 'react-native-size-matters'
import CustomButton from '../components/CustomButton'
import Search from '../components/SearchBar'
import FilterItem from '../components/bookmark/FilterItem'
import Advert from '../components/classifieds/Advert'
import ItemCardTipsandTricks from '../components/tips&tricks/ItemCardTipsandTricks'
import Header from '../components/Header'
import useThemeConstants from '../hooks/useThemeConstants'

const CATEGORIES = [
    { id: 0, title: 'All' },
    { id: 1, title: 'DIY' },
    { id: 2, title: 'Hidden features' },
    { id: 3, title: 'New' },
    { id: 4, title: 'Blah Blah' }
];

const Tipsandtricks = () => {
    const themeConstant = useThemeConstants();

    const [selectedCategory, setSelectedCategory] = useState({ id: 0, title: 'All' });
    const [searchValue, setSearchValue] = useState('');

    const selectACategory = (item) => {
        setSelectedCategory(item)
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
            <Header title='Tips and Tricks' />

            <View style={{ paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
                <Search placeholder={"Search and article"} value={searchValue} setValue={setSearchValue} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: moderateVerticalScale(150), gap: scale(20), marginTop: moderateVerticalScale(20) }}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: scale(10) }}
                        data={CATEGORIES}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity activeOpacity={0.9} onPress={() => selectACategory(item)}>
                                    <FilterItem category={item.title} selected={item.title == selectedCategory.title} />
                                </TouchableOpacity>
                            )
                        }}
                    />

                    <View style={{ gap: scale(20) }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{
                                fontWeight: '700',
                                fontSize: scale(16),
                                color: themeConstant.TEXT_PRIMARY
                            }}>Most Popular</Text>
                            <TouchableOpacity>
                                <Text style={{ color: themeConstant.FADED_BLACK, fontWeight: '400' }}>View all</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <FlatList
                                contentContainerStyle={{ gap: scale(15) }}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={[1, 2, 3, 4, 5]}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => {
                                    return (
                                        <ItemCardTipsandTricks item={item} />
                                    )
                                }}

                            />

                        </View>
                    </View>

                    <Advert url={'https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg'} />

                    <View style={{ gap: scale(20) }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{
                                fontWeight: '700',
                                fontSize: scale(16),
                                color: themeConstant.TEXT_PRIMARY
                            }}>Recommended</Text>
                            <TouchableOpacity>
                                <Text style={{ color: themeConstant.FADED_BLACK, fontWeight: '400' }}>View all</Text>
                            </TouchableOpacity>
                        </View>

                        <View >
                            <FlatList
                                contentContainerStyle={{ gap: scale(15) }}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={[1, 2, 3, 4, 5]}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => {
                                    return (
                                        <ItemCardTipsandTricks />
                                    )
                                }}
                            />
                        </View>
                    </View>

                    <CustomButton title={'Submit Article'} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Tipsandtricks

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})