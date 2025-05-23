import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import { router, useNavigation } from 'expo-router';

import ThemeConstant from '../../../constants/ThemeConstant';
import SearchBar from '../../../components/SearchBar';
import ClassifiedsCategoryItem from '../../../components/classifieds/ClassifiedCategoryItem';
import ClassifiedItemCard from '../../../components/classifieds/ClassifiedItemCard';
import Routes from '../../../constants/Routes';
import useThemeConstants from '../../../hooks/useThemeConstants';

import axios from 'axios';
import API_Data from '../../../constants/API_Data';
import { useSelector } from 'react-redux';
import AdvertMulti from '../../../components/classifieds/AdvertMulti';

const Page = () => {
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const themeConstant = useThemeConstants();
  const [searchValue, setSearchValue] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [classifields, setClassifields] = useState([]);
  const [advertisments, setAdvertisments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    classifiedsText: 'Classifieds',
    merchandiseText: 'Merchandise',
    viewAllText: 'View all',
    searchText: 'Search',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  const navigation = useNavigation();

  const handleNavigate = (classified) => {
    if (classified.name == 'Services') {
      navigation.navigate(Routes.CLASSIFIED_VEHICLES, { category: classified.id, title: classified.name });
      return;
    }
    navigation.navigate(Routes.CLASSIFIED_LISTING_MANUFACTURES, { category: classified.id, categoryName: classified.name });
  };

  useEffect(() => {
    getTranslatedData();
    getCategories();
    getClassifieds();
  }, [selectedLanguage]);

  useEffect(() => {
    axios
      .get(API_Data.url + 'advertisments', {
        params: {
          pages: 'categories',
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

  const getCategories = async () => {
    try {
      const response = await axios.get(API_Data.url + 'categories', {
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      console.log(response.data.page.items);
      if (response.data && response.data.isSuccess && response.data.page) {
        setCategoryList(response.data.page.items);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching Categories:', error);
      return null;
    }
  };

  const getClassifieds = async () => {
    try {
      const response = await axios.get(API_Data.url + 'classifieds', {
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        setClassifields(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Classifieds:', error);
      return null;
    }
  };

  const getByCategory = (category, classifieds) => {
    let categoryClassifieds = [];
    for (const classified of classifieds) {
      if (classified.category.id == category.id) {
        categoryClassifieds.push(classified);
      }
    }
    return categoryClassifieds;
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.classifiedsText}</Text>
            {/* <DrawerButton /> */}
          </View>

          <View>
            <SearchBar placeholder={translateObj.searchText} value={searchValue} setValue={setSearchValue} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: scale(20), paddingBottom: moderateVerticalScale(100) }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                rowGap: scale(10),
                columnGap: scale(6),
              }}
            >
              {categoryList.map((item, index) => (
                <ClassifiedsCategoryItem
                  key={index}
                  onPress={() => handleNavigate(item)}
                  category={item.name}
                  iconName={item.icon}
                />
              ))}
              {!isLoading && (
                <ClassifiedsCategoryItem category={translateObj.merchandiseText} iconName={'gift-open-outline'} />
              )}
              {/* <ClassifiedsCategoryItem onPress={() => handleNavigate("vehicles")} category={'Vehicles'} iconName={'car-electric'} />
                    <ClassifiedsCategoryItem onPress={() => handleNavigate("bikes")} category={"Bikes"} iconName={'motorbike-electric'} />
                    <ClassifiedsCategoryItem onPress={() => handleNavigate("watercraft")} category={'Watercraft'} iconName={'sail-boat'} />
                    <ClassifiedsCategoryItem onPress={() => handleNavigate("accessories")} category={'Accessories'} iconName={'sofa'} />
                    <ClassifiedsCategoryItem onPress={() => handleNavigate("services")} category={'Services'} iconName={'tools'} />
                    <ClassifiedsCategoryItem category={'Merchandise'} iconName={'gift-open-outline'} /> */}
            </View>

            {advertisments && advertisments.length ? (
              <View>
                <AdvertMulti advertisments={advertisments} />
              </View>
            ) : null}

            <View
              style={{
                gap: scale(20),
              }}
            >
              {/* Recents Vehicles */}
              {categoryList.map((category, index) => (
                <View key={index}>
                  {getByCategory(category, classifields).length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // borderWidth: 1,
                      }}
                    >
                      <Text style={{ fontWeight: '700', fontSize: scale(20), color: themeConstant.TEXT_PRIMARY }}>
                        {category.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(Routes.CLASSIFIED_VEHICLES, { title: category.name, category: category.id })
                        }
                      >
                        <Text style={{ color: themeConstant.TEXT_PRIMARY }}>{translateObj.viewAllText}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: scale(12) }}
                    horizontal
                    data={getByCategory(category, classifields)}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => <ClassifiedItemCard item={item} />}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* <View style={{
                position: 'absolute',
                bottom: scale(10),
                width: '100%',
                alignSelf: 'center'
            }}>
                <CustomButton onPress={() => router.push(`${Routes.UPLOAD_AD}`)} title={'Post an Advertisement'} />
            </View> */}
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ThemeConstant.PADDING_MAIN,
    gap: scale(20),
    paddingBottom: moderateVerticalScale(40),
    position: 'relative',
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
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
