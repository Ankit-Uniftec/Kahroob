import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import useThemeConstants from '../hooks/useThemeConstants';
import ThemeConstant from '../constants/ThemeConstant';
import ImagePickerComp from '../components/home/ImagePickerComp';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { LocationContext } from '../context/location';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';
import tabImage1Active from '../../assets/Frame-6.png';
import DateTimePicker from 'react-native-modal-datetime-picker';
import API_Data from '../constants/API_Data';
import axios from 'axios';
import mime from 'mime';
import { useSelector } from 'react-redux';

const AddEVStation = (props) => {
  const themeConstant = useThemeConstants();

  const { currentLocation } = useContext(LocationContext);
  const { user } = useSelector((state) => state.AuthReducer);

  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    addNewEvStationText: 'Add New Charging Station',
    mondayText: 'Monday',
    tuesdayText: 'Tuesday',
    wednesdayText: 'Wednesday',
    thursdayText: 'Thursday',
    fridayText: 'Friday',
    saturdayText: 'Saturday',
    sundayText: 'Sunday',
    lableOther: 'Other',
    lableType2: 'Type 2',
    lableWall: 'Wall',
    errorText: 'Error',
    successText: 'Success',
    stationNameError: 'Station Name Required',
    serviceProviderError: 'Service Provider Required',
    chargerTypeEror: 'Charger Type Required',
    latlongError: 'Latitude and Longitude Required',
    newStationAddedText: 'New station has been added successfully!',
    stationNameText: 'Station Name',
    serviceProviderText: 'Service Provider',
    chargerTypeText: 'Select Charger Type',
    latText: 'Latitude',
    longText: 'Longitude',
    notesText: 'Notes',
    addTimingsText: 'Add Timings',
    addStationText: 'Add Station',
    clickUploadText: 'Click to Upload Images',
    typeSupportText: 'jpg and png only',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  let startDatePicker = new Date();
  startDatePicker.setHours(0, 0, 0, 0);

  const mapRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [stationName, setStationName] = useState('');
  const [provider, setProvider] = useState('');
  const [chargerClass, setChargerClass] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [selectedTiming, setSelectedTiming] = useState();
  const [timings, setTimings] = useState({});
  const [feedback, setFeedback] = useState('');
  const [location, setLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [providersList, setProvidersList] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([
    { value: 'Green Charger' },
    { value: 'ADNOC' },
    { value: 'Tesla' },
    { value: 'Porche' },
    { value: 'Mercedes' },
  ]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    getTranslatedData();
  }, [selectedLanguage]);

  useEffect(() => {
    setLocation({
      latitude: currentLocation?.coords?.latitude.toString(),
      longitude: currentLocation?.coords?.longitude.toString(),
    });
  }, [currentLocation]);

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
      setProvidersList([
        { title: 'Green Charger', icon: 'ev-plug-ccs1', code: 'CCS_1' },
        { title: 'ADNOC', icon: 'ev-plug-ccs2', code: 'CCS_2' },
        { title: 'Telsa', icon: 'ev-plug-chademo', code: 'CHADEMO' },
        { title: 'Porche', icon: 'power-plug', code: 'GB_T' },
        { title: 'Mercedes', icon: 'power-plug', code: 'GB_T_FAST' },
        { title: 'List to be provided', icon: 'ev-plug-type1', code: 'J_1772' },
        // { title: initialTranslateObj.lableType2, icon: 'ev-plug-type2', code: 'TYPE_2' },
        // { title: initialTranslateObj.lableWall, icon: 'power-socket', code: 'WALL' },
        { title: initialTranslateObj.lableOther, icon: 'power-plug', code: 'OTHER' },
      ]);
      setTimings({
        monday: {
          label: initialTranslateObj.mondayText,
          start: '00:00',
          end: '00:00',
        },
        tuesday: {
          label: initialTranslateObj.tuesdayText,
          start: '00:00',
          end: '00:00',
        },
        wednesday: {
          label: initialTranslateObj.wednesdayText,
          start: '00:00',
          end: '00:00',
        },
        thursday: {
          label: initialTranslateObj.thursdayText,
          start: '00:00',
          end: '00:00',
        },
        friday: {
          label: initialTranslateObj.fridayText,
          start: '00:00',
          end: '00:00',
        },
        saturday: {
          label: initialTranslateObj.saturdayText,
          start: '00:00',
          end: '00:00',
        },
        sunday: {
          label: initialTranslateObj.sundayText,
          start: '00:00',
          end: '00:00',
        },
      });
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
        setTimings({
          monday: {
            label: newTranslationObj.mondayText,
            start: '00:00',
            end: '00:00',
          },
          tuesday: {
            label: newTranslationObj.tuesdayText,
            start: '00:00',
            end: '00:00',
          },
          wednesday: {
            label: newTranslationObj.wednesdayText,
            start: '00:00',
            end: '00:00',
          },
          thursday: {
            label: newTranslationObj.thursdayText,
            start: '00:00',
            end: '00:00',
          },
          friday: {
            label: newTranslationObj.fridayText,
            start: '00:00',
            end: '00:00',
          },
          saturday: {
            label: newTranslationObj.saturdayText,
            start: '00:00',
            end: '00:00',
          },
          sunday: {
            label: newTranslationObj.sundayText,
            start: '00:00',
            end: '00:00',
          },
        });
        setProvidersList([
          { title: 'CCS/SAE', icon: 'ev-plug-ccs1', code: 'CCS_1' },
          { title: 'CCS/Mennekes', icon: 'ev-plug-ccs2', code: 'CCS_2' },
          { title: 'CHAdeMO', icon: 'ev-plug-chademo', code: 'CHADEMO' },
          { title: 'GB/T', icon: 'power-plug', code: 'GB_T' },
          { title: 'GB/T (Fast)', icon: 'power-plug', code: 'GB_T_FAST' },
          { title: 'J-1772', icon: 'ev-plug-type1', code: 'J_1772' },
          { title: newTranslationObj.lableType2, icon: 'ev-plug-type2', code: 'TYPE_2' },
          { title: newTranslationObj.lableWall, icon: 'power-socket', code: 'WALL' },
          { title: newTranslationObj.lableOther, icon: 'power-plug', code: 'OTHER' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!stationName || !stationName.length) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.stationNameError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (!provider || !provider.length) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.serviceProviderError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (!chargerType || !chargerType.length) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.chargerTypeEror,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (!location || !location.latitude || !location.longitude) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.latlongError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      var formData = new FormData();
      const newImageUri = 'file:///' + image.uri.split('file:/').join('');
      formData.append('image', {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
      });
      formData.append('name', stationName);
      formData.append('provider', provider);
      formData.append('charger', chargerType);
      formData.append('notes', feedback);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('timings', JSON.stringify(timings));
      setIsLoading(true);
      const response = await axios.post(API_Data.url + 'stations', formData, {
        headers: { ...API_Data.getHeaders(user, selectedLanguage), 'Content-Type': 'multipart/form-data' },
      });
      setIsLoading(false);
      if (response.data && response.data.isSuccess && response.data.data) {
        showMessage({
          message: translateObj.successText,
          description: translateObj.newStationAddedText,
          type: 'success',
          duration: 3000,
        });
        router.back();
      } else {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.errorText,
          type: 'error',
          duration: 1500,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log('getting error in feedback', error);
    }
  };

  const showDatePicker = (timingObj) => {
    setSelectedTiming(timingObj);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setSelectedTiming();
  };

  const handleConfirm = (date) => {
    if (selectedTiming) {
      let timeObj = { ...timings };
      timeObj[selectedTiming.key][selectedTiming.item] = `${
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    }
    hideDatePicker();
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          {props.isChild ? null : <Header title={translateObj.addNewEvStationText} />}

          <DateTimePicker
            textColor='black'
            date={startDatePicker}
            mode='time'
            locale='en_GB' // Use "en_GB" here
            isVisible={isDatePickerVisible}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <ScrollView
            keyboardShouldPersistTaps='never'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: props.isChild ? 0 : 20, flexGrow: 1 }}
          >
            <View style={{ ...styles.inputContainer, ...(props.isChild ? {} : { marginTop: moderateVerticalScale(10) }) }}>
              {/* UPLOAD IMAGE */}
              <ImagePickerComp image={image} setImage={setImage} translateObj={translateObj} />

              <InputField
                placeholder={translateObj.stationNameText + '*'}
                value={stationName}
                onChangeText={(text) => setStationName(text)}
              />

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={serviceProviders}
                maxHeight={scale(250)}
                labelField='value'
                valueField='value'
                placeholder={translateObj.serviceProviderText + '*'}
                value={provider}
                onChange={(item) => {
                  setProvider(item.value);
                }}
              />

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={providersList}
                maxHeight={scale(250)}
                labelField='title'
                valueField='title'
                placeholder={translateObj.chargerTypeText + '*'}
                value={chargerType}
                onChange={(item) => {
                  setChargerType(item.title);
                }}
              />

              <InputField
                placeholder={translateObj.latText + '*'}
                value={location?.latitude}
                onChangeText={(text) => {
                  let locationObj = { ...location };
                  locationObj.latitude = text;
                  setLocation(locationObj);
                  if (location && location.longitude && text) {
                    if (mapRef.current) {
                      mapRef.current.animateToRegion({
                        latitude: Number(text),
                        longitude: Number(location.longitude),
                        latitudeDelta: 0.0422,
                        longitudeDelta: 0.0421,
                      });
                    }
                  }
                }}
              />

              <InputField
                placeholder={translateObj.longText + '*'}
                value={location?.longitude}
                onChangeText={(text) => {
                  let locationObj = { ...location };
                  locationObj.longitude = text;
                  setLocation(locationObj);
                  if (location && location.latitude && text) {
                    if (mapRef.current) {
                      mapRef.current.animateToRegion({
                        latitude: Number(location.latitude),
                        longitude: Number(text),
                        latitudeDelta: 0.0422,
                        longitudeDelta: 0.0421,
                      });
                    }
                  }
                }}
              />

              {/* Map */}
              <View style={{ gap: 8 }}>
                <View style={{ height: scale(200) }}>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider='google'
                    initialRegion={{
                      latitude: currentLocation?.coords?.latitude,
                      longitude: currentLocation?.coords?.longitude,
                      latitudeDelta: 0.0422,
                      longitudeDelta: 0.0421,
                    }}
                    onLongPress={(e) => {
                      // Handle long press events here
                      console.log('Map Long Pressed:', e.nativeEvent.coordinate);
                      setLocation(e.nativeEvent.coordinate);
                      // You can add your logic here to add a marker at the long-pressed location
                    }}
                  >
                    {location && location.latitude && location.longitude ? (
                      <Marker coordinate={{ latitude: Number(location?.latitude), longitude: Number(location?.longitude) }}>
                        <Image
                          source={require('../../assets/custom_pin_1.png')}
                          style={Platform.OS == 'android' ? { width: 28, height: 32 } : { width: 30, height: 34 }}
                          resizeMode='contain'
                        />
                      </Marker>
                    ) : null}
                  </MapView>
                </View>
              </View>

              {/* Feedback */}
              <View
                style={{
                  borderColor: '#00000033',
                  borderWidth: 1,
                  height: moderateVerticalScale(120),
                  padding: scale(10),
                  borderRadius: scale(5),
                }}
              >
                <TextInput
                  value={feedback}
                  onChangeText={(txt) => {
                    if (txt.length <= 200) {
                      setFeedback(txt);
                    }
                  }}
                  multiline
                  numberOfLines={100}
                  placeholder={translateObj.notesText}
                  placeholderTextColor='#00000033'
                  maxLength={200}
                  style={{
                    paddingLeft: 8,
                    width: '100%',
                    fontSize: scale(16),
                    flex: 1,
                    textAlignVertical: 'top',
                  }}
                />
              </View>

              <Text style={{ fontSize: scale(15), paddingTop: scale(10) }}>{translateObj.addTimingsText}</Text>
              {Object.entries(timings).map(([key, v]) => (
                <View key={key}>
                  <Text style={{ fontSize: scale(14), paddingBottom: scale(5) }}>{v.label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable
                      onPress={() => {
                        showDatePicker({
                          key: key,
                          item: 'start',
                        });
                      }}
                      style={styles.timeContainer}
                    >
                      <TextInput
                        onPressIn={() => {
                          showDatePicker({
                            key: key,
                            item: 'start',
                          });
                        }}
                        readOnly={true}
                        style={styles.timeInput}
                        value={v.start}
                        placeholderTextColor='#00000033'
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        showDatePicker({
                          key: key,
                          item: 'end',
                        });
                      }}
                      style={styles.timeContainer}
                    >
                      <TextInput
                        onPressIn={() => {
                          showDatePicker({
                            key: key,
                            item: 'end',
                          });
                        }}
                        readOnly={true}
                        style={styles.timeInput}
                        value={v.end}
                        placeholderTextColor='#00000033'
                      />
                    </Pressable>
                  </View>
                </View>
              ))}

              {/* <View style={{ flex: 1 }} /> */}

              <CustomButton title={translateObj.addStationText} onPress={handleSubmit} loading={isLoading} />
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddEVStation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },
  inputContainer: {
    paddingHorizontal: ThemeConstant.PADDING_MAIN,
    gap: 22,
    marginBottom: 40,
  },
  label: {
    fontSize: scale(14),
    fontWeight: '700',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(50),
    borderColor: '#00000033',
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
    borderRadius: 4,
  },
  imageStyle: {
    width: scale(20),
    height: scale(20),
    marginLeft: scale(5),
  },
  placeholderStyle: {
    alignItems: 'center',
    color: '#00000033',
    fontSize: scale(16),
    flex: 1,
    paddingLeft: 8,
    height: '100%',
  },
  selectedTextStyle: {
    alignItems: 'center',
    fontSize: scale(16),
    flex: 1,
    paddingLeft: 8,
    height: '100%',
  },
  iconStyle: {
    width: scale(25),
    height: scale(25),
    marginRight: scale(5),
  },
  timeContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    marginRight: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(40),
    borderColor: '#00000033',
    borderWidth: 1,
    width: scale(60),
    borderRadius: 4,
  },
  timeInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: scale(13),
    flex: 1,
  },
  eyeButton: {
    padding: 10,
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
