import { StyleSheet, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import useThemeConstants from '../hooks/useThemeConstants';
import ThemeConstant from '../constants/ThemeConstant';
import { TabBar, TabView } from 'react-native-tab-view';
import AddEVStation from './addEVStation';
import AddClassified from './addClassified';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_Data from '../constants/API_Data';

const AddItem = () => {
  const themeConstant = useThemeConstants();
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    addNewText: 'Add New',
    classifiedText: 'CLASSIFIED',
    evStationText: 'EV STATION',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
  }, [selectedLanguage]);

  const getTranslatedData = async () => {
    if (selectedLanguage == 'en') {
      setTranslateObj(initialTranslateObj);
      setIsTranslatesLoaded(true);
      setRoutes([
        { key: 'classified', title: initialTranslateObj.classifiedText },
        { key: 'station', title: initialTranslateObj.evStationText },
      ]);
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
        setRoutes([
          { key: 'classified', title: newTranslationObj.classifiedText },
          { key: 'station', title: newTranslationObj.evStationText },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={{ backgroundColor: 'white' }}
      indicatorStyle={{
        backgroundColor: themeConstant.PRIMARY_COLOR,
      }}
      labelStyle={{
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
      }}
      activeColor={themeConstant.PRIMARY_COLOR}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'classified':
        return <AddClassified isChild={true}></AddClassified>;
      case 'station':
        return <AddEVStation isChild={true}></AddEVStation>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.addNewText} />

          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateVerticalScale(10),
    position: 'relative',
  },
  inputContainer: {
    marginTop: moderateVerticalScale(10),
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
