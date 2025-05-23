import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import tabImage1Active from '../../../../assets/Frame-6.png';
import tabImage1 from '../../../../assets/Frame-7.png';
import ThemeConstant from '../../../constants/ThemeConstant';
import Routes from '../../../constants/Routes';
import Header from '../../../components/Header';
import useThemeConstants from '../../../hooks/useThemeConstants';
import CustomButton from '../../../components/CustomButton';
import {
  SET_RADIUS,
  SET_CONNECTORS,
  SET_CHARGING_SPEED,
  SET_NETWORKS,
  SET_AVAILABLE_NOW,
} from '../../../store/allactionsTypes';
import { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MultiSelect } from 'react-native-element-dropdown';
import axios from 'axios';
import API_Data from '../../../constants/API_Data';

const MapFilter = () => {
  const dispatch = useDispatch();
  const themeConstant = useThemeConstants();
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const { radius } = useSelector((state) => state.AppReducer);
  const { isAvailableNow } = useSelector((state) => state.AppReducer);
  const { selectedNetworks } = useSelector((state) => state.AppReducer);
  const { selectedChargingTypes } = useSelector((state) => state.AppReducer);
  const { selectedCharginSpeed } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    radiusText: 'Radius',
    chargerNetworkText: 'Charger Network',
    selectNetworkText: 'Select Network',
    chargerTypeText: 'Charger Type',
    availabilityText: 'Availability',
    openNowText: 'Open Now',
    applyFilterText: 'Apply Filter',
    lableBlink: 'Blink',
    lableFastned: 'Fastned',
    lableMercurySarj: 'MERCURY SARJ',
    lableSupercharger: 'Supercharger',
    lableTesla_destination: 'Tesla Destination',
    lableOther: 'Other',
    titleText: 'Filter',
    chargingSpeedText: 'Charger Speed',
    lableType2: 'Type 2',
    lableWall: 'Wall',
  }
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  const [radiusData, setRadius] = useState(50);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedChargerNetworks, setselectedNetworks] = useState([]);

  const [multiSliderValue, setMultiSliderValue] = useState([0, 350]);

  const [networksData, setNetworksData] = useState([]);
  const [providersList, setProvidersList] = useState([]);

  useEffect(() => {
    getTranslatedData();
    if (radius && radius / 1000) {
      setRadius(radius / 1000);
    } else {
      setRadius(50);
    }
    if (selectedChargingTypes) {
      setSelectedTypes(selectedChargingTypes);
    }
    if (selectedCharginSpeed) {
      setMultiSliderValue(selectedCharginSpeed);
    }
    if (isAvailableNow == true || isAvailableNow == false) {
      setIsAvailable(isAvailableNow);
    }
    if (selectedNetworks) {
      setselectedNetworks(selectedNetworks);
    }
  }, [selectedLanguage]);

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
      setNetworksData([
        { label: initialTranslateObj.lableBlink, value: 'blink' },
        { label: initialTranslateObj.lableFastned, value: 'fastned' },
        { label: initialTranslateObj.lableMercurySarj, value: 'mercury_sarj' },
        { label: initialTranslateObj.lableSupercharger, value: 'supercharger' },
        { label: initialTranslateObj.lableTesla_destination, value: 'tesla_destination' },
        { label: initialTranslateObj.lableOther, value: 'other' },
      ]);
      setProvidersList([
        { title: 'CCS/SAE', icon: 'ev-plug-ccs1', code: 'CCS_1' },
        { title: 'CCS/Mennekes', icon: 'ev-plug-ccs2', code: 'CCS_2' },
        { title: 'CHAdeMO', icon: 'ev-plug-chademo', code: 'CHADEMO' },
        { title: 'GB/T', icon: 'power-plug', code: 'GB_T' },
        { title: 'GB/T (Fast)', icon: 'power-plug', code: 'GB_T_FAST' },
        { title: 'J-1772', icon: 'ev-plug-type1', code: 'J_1772' },
        { title: initialTranslateObj.lableType2, icon: 'ev-plug-type2', code: 'TYPE_2' },
        { title: initialTranslateObj.lableWall, icon: 'power-socket', code: 'WALL' },
        { title: initialTranslateObj.lableOther, icon: 'power-plug', code: 'OTHER' },
      ]);
      setIsTranslatesLoaded(true);
      return;
    }
    try {
      const response = await axios.post(API_Data.url + '/translate', {
        data: translateObj,
        output: selectedLanguage,
      });
      console.log(JSON.stringify(response.data));
      if (response.data && response.data.isSuccess && response.data.data) {
        let newTranslationObj = response.data.data;
        setTranslateObj(newTranslationObj);
        setNetworksData([
          { label: newTranslationObj.lableBlink, value: 'blink' },
          { label: newTranslationObj.lableFastned, value: 'fastned' },
          { label: newTranslationObj.lableMercurySarj, value: 'mercury_sarj' },
          { label: newTranslationObj.lableSupercharger, value: 'supercharger' },
          { label: newTranslationObj.lableTesla_destination, value: 'tesla_destination' },
          { label: newTranslationObj.lableOther, value: 'other' },
        ]);
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
      console.log(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const sliderToRadius = (value) => {
    return value * 1000;
  };

  const handleApply = () => {
    console.log(radiusData, 'radiusData');
    if (radiusData <= 0) {
      showMessage({ message: 'Error', description: 'Value must be greater than 0', type: 'danger', duration: 3000 });
      return;
    }
    dispatch({ type: SET_RADIUS, payload: sliderToRadius(radiusData).toFixed(1) });
    dispatch({ type: SET_CONNECTORS, payload: selectedTypes });
    dispatch({ type: SET_NETWORKS, payload: selectedChargerNetworks });
    dispatch({ type: SET_CHARGING_SPEED, payload: multiSliderValue });
    dispatch({ type: SET_AVAILABLE_NOW, payload: isAvailable });
    router.back();
  };

  const multiSliderValuesChange = (values) => {
    setMultiSliderValue(values);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.titleText} />

          <ScrollView
            keyboardShouldPersistTaps='never'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, flexGrow: 1 }}
          >
            <View style={{ flex: 1, paddingTop: 15, paddingBottom: 50, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
              <View>
                <Text style={[styles.label, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.radiusText}</Text>
                <Text style={styles.smalllabel}>{radiusData + 'km'}</Text>
                <MultiSlider
                  selectedStyle={{
                    backgroundColor: themeConstant.PRIMARY_COLOR,
                  }}
                  unselectedStyle={{
                    backgroundColor: themeConstant.FADED_BLACK,
                  }}
                  values={[radiusData]}
                  sliderLength={scale(300)}
                  onValuesChange={(value) => setRadius(value)}
                  min={0}
                  max={50}
                  step={1}
                  allowOverlap
                  snapped
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.chargerNetworkText}</Text>
                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={{ ...styles.selectedTextStyle, ...{ color: themeConstant.PRIMARY_COLOR } }}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={networksData}
                  labelField='label'
                  valueField='value'
                  placeholder={translateObj.selectNetworkText}
                  value={selectedChargerNetworks}
                  onChange={(item) => {
                    setselectedNetworks(item);
                  }}
                  selectedStyle={styles.selectedStyle}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.chargerTypeText}</Text>
                <FlatList
                  scrollEnabled={false}
                  style={{
                    marginTop: scale(5),
                    paddingHorizontal: 1,
                    paddingVertical: 2,
                  }}
                  data={providersList}
                  numColumns={3}
                  renderItem={({ item, index }) => (
                    <Pressable
                      onPress={() => {
                        let selectedTypesObj = [...selectedTypes];
                        if (selectedTypes.indexOf(item.code) > -1) {
                          selectedTypesObj.splice(selectedTypes.indexOf(item.code), 1);
                        } else {
                          selectedTypesObj.push(item.code);
                        }
                        setSelectedTypes(selectedTypesObj);
                      }}
                      style={{
                        ...styles.flatListElement,
                        ...(selectedTypes.indexOf(item.code) > -1
                          ? { backgroundColor: themeConstant.PRIMARY_COLOR }
                          : { backgroundColor: 'white' }),
                      }}
                    >
                      {item.image ? (
                        <Image
                          source={selectedTypes.indexOf(item.code) > -1 ? item.image : item.inActiveimage}
                          style={styles.typeImage}
                        />
                      ) : null}
                      {item.icon ? (
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={25}
                          color={selectedTypes.indexOf(item.code) > -1 ? 'white' : themeConstant.PRIMARY_COLOR}
                        />
                      ) : null}
                      <Text
                        style={{
                          ...styles.flatListElementText,
                          ...(item.image || item.icon ? { marginTop: scale(3) } : { height: '100%' }),
                          ...(selectedTypes.indexOf(item.code) > -1 ? { color: 'white' } : { color: 'black' }),
                        }}
                      >
                        {item.title}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
              {/* <View style={{ marginTop: 20 }}>
            <Text style={[styles.label, { color: themeConstant.TEXT_PRIMARY }]}>Charger Class</Text>
          </View> */}
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.availabilityText}</Text>
                <View style={{ width: '100%', justifyContent: 'start', alignItems: 'start' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Switch
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      // trackColor={{ false: 'white', true: themeConstant.TEXT_PRIMARY }}
                      thumbColor={isAvailable ? themeConstant.PRIMARY_COLOR : themeConstant.TEXT_PRIMARY}
                      ios_backgroundColor='white'
                      onValueChange={() => setIsAvailable(!isAvailable)}
                      value={isAvailable}
                    />
                    <Text
                      style={{
                        color: themeConstant.TEXT_PRIMARY,
                        fontSize: scale(13),
                        fontWeight: '700',
                        paddingLeft: scale(5),
                      }}
                    >
                      {translateObj.openNowText}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.label, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.chargingSpeedText}</Text>
                <View style={{ width: scale(300), margin: 'auto' }}>
                  <Text style={styles.smalllabel}>
                    {multiSliderValue[0] + 'kW - ' + multiSliderValue[1] + (multiSliderValue[1] == 350 ? '+kW' : 'kW')}
                  </Text>
                  <MultiSlider
                    selectedStyle={{
                      backgroundColor: themeConstant.PRIMARY_COLOR,
                    }}
                    unselectedStyle={{
                      backgroundColor: themeConstant.FADED_BLACK,
                    }}
                    values={[multiSliderValue[0], multiSliderValue[1]]}
                    sliderLength={scale(300)}
                    onValuesChange={multiSliderValuesChange}
                    min={0}
                    max={350}
                    step={1}
                    allowOverlap
                    snapped
                    customLabel={'KW'}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ marginTop: 20, width: '50%', alignSelf: 'center' }}>
                <CustomButton title={translateObj.applyFilterText} onPress={handleApply} />
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MapFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  img: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(10),
    resizeMode: 'cover',
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    fontSize: scale(14),
    fontWeight: '700',
  },
  smalllabel: {
    marginTop: scale(10),
    width: '100%',
    textAlign: 'center',
    fontSize: scale(13),
    fontWeight: '700',
    color: 'gray',
  },
  typeImage: {
    width: scale(28),
    height: scale(28),
  },
  flatListElement: {
    alignItems: 'center',
    width: (Dimensions.get('screen').width - 60) / 3,
    height: scale(60),
    borderWidth: 0.5,
    borderColor: 'gray',
    paddingTop: scale(10),
    paddingBottom: scale(10),
  },
  flatListElementText: {
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: scale(12),
  },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: scale(14),
  },
  selectedTextStyle: {
    fontSize: scale(12),
  },
  inputSearchStyle: {
    height: 40,
    fontSize: scale(14),
  },
  selectedStyle: {
    borderRadius: 12,
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
