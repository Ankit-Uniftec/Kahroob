import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import ThemeConstant from '../constants/ThemeConstant';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import Line from '../components/profile/line';
import Advert from '../components/classifieds/Advert';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import useThemeConstants from '../hooks/useThemeConstants';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_Data from '../constants/API_Data';

const Contactus = () => {
  const themeConstant = useThemeConstants();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [characterCount, setCharacterCount] = useState('0');
  const [categories, setCategories] = useState([]);

  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    contactUsText: 'Contact us',
    evStationText: 'EV Charging Station',
    tipsText: 'Tips and Tricks',
    classifiedsText: 'Classifieds',
    yourMessageText: 'Your Message',
    feelFreeText: 'Feel free to reach out through the contact form below',
    selectCategoryText: 'Select Category',
    submitText: 'Submit',
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
        setCategories([
          {
            id: 1,
            name: newTranslationObj.evStationText,
          },
          {
            id: 2,
            name: newTranslationObj.tipsText,
          },
          {
            id: 3,
            name: newTranslationObj.classifiedsText,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const selectACategory = (item) => {
    if (selectedCategory?.name === item.name) setSelectedCategory('');
    else setSelectedCategory(item);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          <Header title={translateObj.contactUsText} />

          <View style={{ paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
            <Text
              style={{
                color: themeConstant.TEXT_PRIMARY,
                fontWeight: '400',
                fontSize: scale(14),
                marginTop: scale(30),
                marginBottom: moderateVerticalScale(20),
              }}
            ></Text>
            <Line />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: moderateVerticalScale(150) }}
            >
              <View style={{ marginTop: moderateVerticalScale(20) }}>
                <Text
                  style={{
                    color: themeConstant.TEXT_PRIMARY,
                    fontWeight: '700',
                    fontSize: scale(14),
                    marginBottom: moderateVerticalScale(20),
                  }}
                >
                  {translateObj.selectCategoryText}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    rowGap: moderateVerticalScale(20),
                    marginBottom: moderateVerticalScale(20),
                  }}
                >
                  {categories.map((item) => {
                    return (
                      <TouchableOpacity
                        onPress={() => selectACategory(item)}
                        activeOpacity={1}
                        key={item.id}
                        style={{ flexDirection: 'row', alignItems: 'center', width: '50%', gap: scale(5) }}
                      >
                        <View
                          style={{
                            width: scale(15),
                            height: scale(15),
                            borderWidth: scale(1),
                            borderColor: ThemeConstant.PRIMARY_COLOR,
                            borderRadius: scale(1000),
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <View
                            style={{
                              width: scale(10),
                              height: scale(10),
                              backgroundColor:
                                selectedCategory?.name == item.name ? ThemeConstant.PRIMARY_COLOR : 'transparent',
                              borderRadius: scale(1000),
                            }}
                          />
                        </View>
                        <Text style={{ color: themeConstant.TEXT_PRIMARY }}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: ThemeConstant.FADED_BLACK,
                    height: moderateVerticalScale(120),
                    padding: scale(10),
                    borderRadius: scale(5),
                  }}
                >
                  <TextInput
                    value={message}
                    onChangeText={(txt) => {
                      const remaingChars = txt.length;
                      setCharacterCount(remaingChars);
                      if (txt.length <= 200) {
                        setMessage(txt);
                      }
                    }}
                    multiline
                    numberOfLines={100}
                    placeholder={translateObj.yourMessageText}
                    placeholderTextColor={themeConstant.FADED_BLACK}
                    maxLength={200}
                    style={{
                      color: themeConstant.TEXT_PRIMARY,
                      flex: 1,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>

                <Text
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: scale(5),
                    color: ThemeConstant.FADED_BLACK,
                    fontSize: scale(10),
                    marginBottom: moderateVerticalScale(20),
                  }}
                >
                  {characterCount}/200
                </Text>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: ThemeConstant.FADED_BLACK,
                    height: moderateVerticalScale(210),
                    marginBottom: moderateVerticalScale(20),
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={{
                      uri: 'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/130291669/original/966a566e1455049c9af317c89b7cd76bd3ee8416/design-clean-and-owesme-add-banner.png',
                    }}
                  />
                </View>

                <CustomButton title={translateObj.submitText} />
              </View>
            </ScrollView>
          </View>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Contactus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
