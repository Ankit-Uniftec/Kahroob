import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import useThemeConstants from '../hooks/useThemeConstants';
import ThemeConstant from '../constants/ThemeConstant';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import { showMessage } from 'react-native-flash-message';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';
import API_Data from '../constants/API_Data';
import axios from 'axios';
import { router } from 'expo-router';
import MultiImagePickerComp from '../components/home/MultiImagePickerComp';
import mime from 'mime';
import { useSelector } from 'react-redux';

const AddClassified = (props) => {
  const themeConstant = useThemeConstants();
  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerList, setManufacturerList] = useState([]);
  const [model, setModel] = useState(null);
  const [modelInput, setModelInput] = useState('');
  const [modelList, setModelList] = useState([]);
  const [milage, setMilage] = useState('');
  const [applicability, setApplicability] = useState('');
  const [usage, setUsage] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [body, setBody] = useState('');
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [engine, setEngine] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [range, setRange] = useState('');
  const [regional, setRegional] = useState('');
  const [doors, setDoors] = useState('');
  const [battery, setBattery] = useState('');
  const [warrenty, setWarrenty] = useState('');
  const [color, setColor] = useState('');
  const [images, setImages] = useState([]);
  const [engineList, setEngineList] = useState([]);

  const [motor, setMotor] = useState('');
  const [horsePower, setHorsePower] = useState('');
  const [chargePort, setChargePort] = useState('');
  const [autoPilot, setAutoPilot] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [sellerType, setSellerType] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const [bodyTypes, setBodyTypes] = useState([
    { value: 'Coupe' },
    { value: 'SUV' },
    { value: 'Turck' },
    { value: 'Hatchback' },
    { value: 'Sedan' },
    { value: 'Cross' },
    { value: 'Other' },
  ]);
  const [regionalTypes, setRegionalTypes] = useState([
    { value: 'GCC' },
    { value: 'US' },
    { value: 'CN' },
    { value: 'EU' },
    { value: 'Other' },
  ]);
  const [doorValues, setDoorValues] = useState([{ value: '2' }, { value: '3' }, { value: '4' }, { value: '+5' }]);


  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    addNewClassifiedText: 'Add New Classified',
    errorText: 'Error',
    successText: 'Success',
    clickUploadText: 'Click to Upload Images',
    typeSupportText: 'jpg and png only',
    addMoreImagesText: 'Add More Images',
    categoryRequiredError: 'Category Required',
    imageRequiredError: 'Atleas One Image Required',
    manufacturerRequiredError: 'Manufacturer Required',
    modelRequiredError: 'Model Required',
    kilometersRequiredError: 'Kilometers Required',
    yearRequiredError: 'Year Required',
    engineTypeRequiredError: 'Engine Type Required',
    addressRequiredError: 'Address Required',
    priceRequiredError: 'Price Required',
    modelRequiredError: 'Model Required',
    colorRequiredError: 'Color Required',
    classifiedSubmittedText: 'Classified is submitted for Review!',
    selectCategoryText: 'Select Category',
    selectManufacturerText: 'Select Manufacturer',
    selectModelText: 'Select Model',
    modelText: 'Model',
    applicabilityText: 'Applicability',
    usageText: 'Usage',
    bodyText: 'Body Type',
    kilometersText: 'Kilometers',
    yearText: 'Year',
    fuelText: 'Select Engine Type',
    chargerText: 'Charger',
    addressText: 'Address',
    priceText: 'Price',
    rangeText: 'Range',
    milageText: 'Milage',
    regionalText: 'Regional Specs',
    doorsText: 'Doors',
    batteryText: 'Battery Capacity (KWh)',
    warrentyText: 'Warranty',
    colorsText: 'Color',
    addClassifiedText: 'Add Classified',
    electricText: 'Electric',
    petrolText: 'Petrol',
    dieselText: 'Diesel',
    hybridText: 'Hybrid',
    motorRequiredError: "Motor error"
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getCategories();
    getTranslatedData();
  }, [selectedLanguage]);

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
      setEngineList([
        { title: initialTranslateObj.electricText },
        { title: initialTranslateObj.hybridText },
      ]);
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
        setEngineList([
          { title: newTranslationObj.electricText },
          { title: newTranslationObj.hybridText },
        ]);
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
      if (response.data && response.data.isSuccess && response.data.page) {
        setCategoryList(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Categories:', error);
      return null;
    }
  };

  const getManufacturers = async (category) => {
    try {
      const response = await axios.get(API_Data.url + 'manufacturers', {
        params: {
          category: category,
        },
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        setManufacturerList(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Manufacturers:', error);
      return null;
    }
  };

  const getModels = async (manufacturer) => {
    try {
      const response = await axios.get(API_Data.url + 'models', {
        params: {
          manufacturer: manufacturer,
        },
        headers: API_Data.getHeaders(user, selectedLanguage),
      });
      if (response.data && response.data.isSuccess && response.data.page) {
        setModelList(response.data.page.items);
      }
    } catch (error) {
      console.error('Error fetching Models:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!category || !category.length) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.categoryRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (images.length < 1) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.imageRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('manufacturer') && (!manufacturer || !manufacturer.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.manufacturerRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('model') && (!model || !model.id)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.modelRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('kilometers') && (!kilometers || !kilometers.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.kilometersRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('year') && (!year || !year.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.yearRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('motor') && (!motor || !motor.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.motorRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('fuel') && (!engine || !engine.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.engineTypeRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('address') && (!address || !address.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.addressRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      if (categoryFilters.includes('price') && (!price || !price.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.priceRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }

      if (categoryFilters.includes('model-text') && (!modelInput || !modelInput.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.modelRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }

      if (categoryFilters.includes('colors') && (!color || !color.length)) {
        showMessage({
          message: translateObj.errorText,
          description: translateObj.colorRequiredError,
          type: 'error',
          duration: 1500,
        });
        return;
      }
      var formData = new FormData();
      for (const image of images) {
        const newImageUri = 'file:///' + image.uri.split('file:/').join('');
        formData.append('image', {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split('/').pop(),
        });
      }
      formData.append('kilometers', kilometers);
      formData.append('year', year);
      formData.append('fuel', engine);
      formData.append('chargerType', chargerType);
      formData.append('body', body);
      formData.append('address', address);
      formData.append('price', price);
      formData.append('range', range);
      formData.append('milage', milage);
      formData.append('regional', regional);
      formData.append('doors', doors);
      formData.append('battery', battery);
      formData.append('warrenty', warrenty);
      formData.append('color', color);
      formData.append('modelText', categoryFilters.includes('model-text') ? modelInput : null);
      formData.append('applicability', categoryFilters.includes('applicability') ? applicability : null);
      formData.append('usage', categoryFilters.includes('usage') ? usage : null);
      formData.append('model', categoryFilters.includes('model') ? model?.id : null);
      formData.append('category', category);
      formData.append('manufacturer', manufacturer);
      formData.append('motor', motor);
      setIsLoading(true);
      const response = await axios.post(API_Data.url + 'classifieds', formData, {
        headers: { ...API_Data.getHeaders(user, selectedLanguage), 'Content-Type': 'multipart/form-data' },
      });
      setIsLoading(false);
      if (response.data && response.data.isSuccess && response.data.data) {
        showMessage({
          message: translateObj.successText,
          description: translateObj.classifiedSubmittedText,
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
      console.error('getting error', error);
    }
  };

  // Example JSON data for dropdowns
  const motorOptions = [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: 'Other' },
  ];

  const horsePowerOptions = [
    { value: '0-100 HP' },
    { value: '100-500 HP' },
    { value: '500-1000 HP' },
    { value: '+1000 HP' },
    { value: 'Unknown' },
  ];

  const chargePortOptions = [
    { value: 'J1772 (Type 1)' },
    { value: 'Mennekes Type 2' },
    { value: 'CCS 1' },
    { value: 'CCS 2' },
    { value: 'CHAdeMO' },
    { value: 'GB/T' },
  ];

  const autoPilotOptions = [
    { value: 'Yes' },
    { value: 'No' },
  ];

  const seatingCapacityOptions = [
    { value: '1' },
    { value: '2' },
    { value: '4' },
    { value: '5' },
    { value: '8' },
    { value: '9' },
    { value: 'Others' },
  ];

  const sellerTypeOptions = [
    { value: 'Individual' },
    { value: 'Retailer' },
    { value: 'Agency' },
  ];

  const countryOptions = [
    { value: 'UAE' },
    // { value: 'Canada' },
    // { value: 'UK' },
    // { value: 'Australia' },
  ];

  const cityOptions = [
    { value: 'Abu Dhabi' },
    { value: 'Dubai' },
    { value: 'Sharjah' },
    { value: 'Ajman' },
    { value: 'Umm AlQuwain' },
    { value: 'Ras AlKhaima' },
    { value: 'Fujairah' },
  ];

  const colorOptions = [
    { value: 'Red' },
    { value: 'Blue' },
    { value: 'Green' },
    { value: 'Black' },
    { value: 'White' },
    { value: 'Other' },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          {props.isChild ? null : <Header title={translateObj.addNewClassifiedText} />}

          <ScrollView
            keyboardShouldPersistTaps='never'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: props.isChild ? 0 : 20, flexGrow: 1 }}
          >
            <View style={{ ...styles.inputContainer, ...(props.isChild ? {} : { marginTop: moderateVerticalScale(10) }) }}>
              <MultiImagePickerComp images={images} setImages={setImages} translateObj={translateObj} />

              <Dropdown
                style={styles.dropdown}
                imageStyle={styles.imageStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={categoryList}
                maxHeight={scale(250)}
                labelField='name'
                valueField='id'
                placeholder={translateObj.selectCategoryText + '*'}
                value={category}
                onChange={(item) => {
                  setManufacturerList([]);
                  setManufacturer('');
                  setModelList([]);
                  getManufacturers(item.id);
                  setCategory(item.id);
                  setCategoryFilters(item.filters);
                }}
              />

              {categoryFilters.includes('manufacturer') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={manufacturerList}
                  maxHeight={scale(250)}
                  disable={manufacturerList.length < 1}
                  labelField='name'
                  valueField='id'
                  placeholder={translateObj.selectManufacturerText + '*'}
                  value={manufacturer}
                  onChange={(item) => {
                    setModelList([]);
                    setModel(null);
                    getModels(item.id);
                    setManufacturer(item.id);
                  }}
                />
              )}

              {categoryFilters.includes('model') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={modelList}
                  maxHeight={scale(250)}
                  disable={modelList.length < 1}
                  labelField='name'
                  valueField='id'
                  placeholder={translateObj.selectModelText + '*'}
                  value={model?.id}
                  onChange={(item) => {
                    setModel(item);
                    if (item.charger) {
                      setChargerType(item.charger);
                      setEngine('Electric');
                    }
                    if (item.body) {
                      setBody(item.body);
                    }
                  }}
                />
              )}

              {categoryFilters.includes('model-text') && (
                <InputField
                  placeholder={translateObj.modelText + '*'}
                  value={modelInput}
                  onChangeText={(text) => setModelInput(text)}
                />
              )}

              {categoryFilters.includes('applicability') && (
                <InputField
                  placeholder={translateObj.applicabilityText}
                  value={applicability}
                  onChangeText={(text) => setApplicability(text)}
                />
              )}

              {/* {categoryFilters.includes('usage') && (
                <InputField placeholder={translateObj.usageText} value={usage} onChangeText={(text) => setUsage(text)} />
              )} */}
              {categoryFilters.includes('usage') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={[
                    { value: 'Not Used' },
                    { value: 'Light Usage' },
                    { value: 'Heavy Usage' },
                  ]}
                  maxHeight={scale(250)}
                  labelField='value'
                  valueField='value'
                  placeholder={translateObj.usageText}
                  value={usage}
                  onChange={(item) => setUsage(item.value)}
                />
              )}

              {categoryFilters.includes('body') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={bodyTypes}
                  maxHeight={scale(250)}
                  labelField='value'
                  valueField='value'
                  placeholder={translateObj.bodyText}
                  value={body}
                  onChange={(item) => {
                    setBody(item.value);
                  }}
                />
              )}

              {categoryFilters.includes('kilometers') && (
                <InputField
                  keyboardType='numeric'
                  placeholder={translateObj.kilometersText + '*'}
                  value={kilometers}
                  onChangeText={(text) => setKilometers(text)}
                />
              )}

              {categoryFilters.includes('year') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={Array.from({ length: 30 }, (_, i) => ({ value: (new Date().getFullYear() - i).toString() }))}
                  maxHeight={scale(250)}
                  labelField='value'
                  valueField='value'
                  placeholder={translateObj.yearText + '*'}
                  value={year}
                  onChange={(item) => setYear(item.value)}
                />
              )}

              {categoryFilters.includes('fuel') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={engineList}
                  maxHeight={scale(250)}
                  labelField='title'
                  valueField='title'
                  placeholder={translateObj.fuelText + '*'}
                  value={engine}
                  onChange={(item) => {
                    setEngine(item.title);
                  }}
                />
              )}

              {categoryFilters.includes('charger') && engine == 'Electric' && (
                <InputField
                  placeholder={translateObj.chargerText + '*'}
                  value={chargerType}
                  onChangeText={(text) => setChargerType(text)}
                />
              )}

              {categoryFilters.includes('address') && (
                <InputField
                  placeholder={translateObj.addressText + '*'}
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                />
              )}



              {categoryFilters.includes('range') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={[
                    { value: 'Less than 250Km' },
                    { value: '250-350Km' },
                    { value: '350-450Km' },
                    { value: '450-550Km' },
                    { value: '550-650Km' },
                    { value: '+600Km' },
                    { value: '+1000Km' },
                    { value: 'Unknown' },
                  ]}
                  maxHeight={scale(250)}
                  labelField="value"
                  valueField="value"
                  placeholder={translateObj.rangeText}
                  value={range}
                  onChange={(item) => setRange(item.value)}
                />
              )}

              {categoryFilters.includes('milage') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={[
                    { value: '0-10,000' },
                    { value: '10,000-50,000' },
                    { value: '50,000-100,000' },
                    { value: '100,000-150,000' },
                    { value: '150,000-200,000' },
                    { value: '200,000+' },
                  ]}
                  maxHeight={scale(250)}
                  labelField="value"
                  valueField="value"
                  placeholder={translateObj.milageText}
                  value={milage}
                  onChange={(item) => setMilage(item.value)}
                />
              )}


              {categoryFilters.includes('regional') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={regionalTypes}
                  maxHeight={scale(250)}
                  labelField='value'
                  valueField='value'
                  placeholder={translateObj.regionalText}
                  value={regional}
                  onChange={(item) => {
                    setRegional(item.value);
                  }}
                />
              )}

              {categoryFilters.includes('doors') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={doorValues}
                  maxHeight={scale(250)}
                  labelField='value'
                  valueField='value'
                  placeholder={translateObj.doorsText}
                  value={doors}
                  onChange={(item) => {
                    setDoors(item.value);
                  }}
                />
              )}

              {categoryFilters.includes('battery') && (
                <InputField
                  placeholder={translateObj.batteryText}
                  value={battery}
                  onChangeText={text => setBattery(text)}
                  keyboardType="numeric"
                />
              )}
              {categoryFilters.includes('warrenty') && (
                <Dropdown
                  style={styles.dropdown}
                  imageStyle={styles.imageStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={[
                    { value: 'Yes' },
                    { value: 'No' },
                  ]}
                  maxHeight={scale(250)}
                  labelField="value"
                  valueField="value"
                  placeholder={translateObj.warrentyText}
                  value={warrenty}
                  onChange={(item) => setWarrenty(item.value)}
                />
              )}

              {categoryFilters.includes('motor') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={motorOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Motor'
                  value={motor}
                  onChange={(item) => setMotor(item.value)}
                />
              )}

              {categoryFilters.includes('horsePower') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={horsePowerOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Horse Power'
                  value={horsePower}
                  onChange={(item) => setHorsePower(item.value)}
                />
              )}

              {categoryFilters.includes('chargePort') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={chargePortOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Charge Port'
                  value={chargePort}
                  onChange={(item) => setChargePort(item.value)}
                />
              )}

              {categoryFilters.includes('autoPilot') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={autoPilotOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Auto Pilot'
                  value={autoPilot}
                  onChange={(item) => setAutoPilot(item.value)}
                />
              )}

              {categoryFilters.includes('seatingCapacity') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={seatingCapacityOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Seating Capacity'
                  value={seatingCapacity}
                  onChange={(item) => setSeatingCapacity(item.value)}
                />
              )}

              {categoryFilters.includes('sellerType') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={sellerTypeOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Seller Type'
                  value={sellerType}
                  onChange={(item) => setSellerType(item.value)}
                />
              )}

              {categoryFilters.includes('country') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={countryOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select Country'
                  value={country}
                  onChange={(item) => setCountry(item.value)}
                />
              )}

              {categoryFilters.includes('city') && (
                <Dropdown
                  style={styles.dropdown}
                  iconStyle={styles.iconStyle}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={cityOptions}
                  labelField='value'
                  valueField='value'
                  placeholder='Select City'
                  value={city}
                  onChange={(item) => setCity(item.value)}
                />
              )}
              <Dropdown
                style={styles.dropdown}
                iconStyle={styles.iconStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={colorOptions}
                labelField='value'
                valueField='value'
                placeholder={translateObj.colorsText + '*'}
                value={color}
                onChange={(item) => setColor(item.value)}
              />
              <InputField
                keyboardType='numeric'
                placeholder={translateObj.priceText + '*'}
                value={price}
                onChangeText={(text) => setPrice(text)}
              />
              {category ? (
                <CustomButton title={translateObj.addClassifiedText} onPress={handleSubmit} loading={isLoading} />
              ) : null}
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

export default AddClassified;

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
  imagePickerContainer: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateVerticalScale(120),
    borderRadius: scale(5),
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