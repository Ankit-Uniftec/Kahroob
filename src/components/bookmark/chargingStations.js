import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ItemCard from './Itemcard';
import { scale } from 'react-native-size-matters';
import useThemeConstants from '../../hooks/useThemeConstants';
import { BOOKMARK_STATIONS } from '../../store/allactionsTypes';
import { LocationContext } from '../../context/location';
import { router } from 'expo-router';
import Routes from '../../constants/Routes';
import axios from 'axios';
import API_Data from '../../constants/API_Data';

const BookmarkStations = ({ data = [] }) => {
  const dispatch = useDispatch();

  const themeConstant = useThemeConstants();
  const { user } = useSelector((state) => state.AuthReducer);
  const { chargingStations } = useSelector((state) => state.ThemeReducer);

  const { setEVStation } = useContext(LocationContext);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    emptyError: 'No charging stations added yet.',
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslatesLoaded(true);
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      let findIndex = chargingStations.findIndex((f) => f.userId === user?.id && f.id == item.id);

      const handleNavigate = () => {
        setEVStation(item);
        router.push({ pathname: `${Routes.HOME_STATION_DETAIL}` });
      };

      const handleFavorite = async () => {
        if (findIndex !== -1) {
          // If already favorite, remove it
          let updatedStations = [...chargingStations];
          updatedStations.splice(findIndex, 1);
          dispatch({ type: BOOKMARK_STATIONS, payload: updatedStations });
        }
      };

      return <ItemCard item={item} handleNavigate={handleNavigate} handleFavorite={handleFavorite} />;
    },
    [data, chargingStations]
  );

  return (
    <View>
      {isTranslatesLoaded ? (
        <FlatList
          data={data.filter((f) => f.userId === user?.id)}
          renderItem={renderItem}
          keyExtractor={(_, index) => `station-${index}`}
          ListEmptyComponent={() => (
            <Text style={[styles.txt, { color: themeConstant.TEXT_PRIMARY }]}>{translateObj.emptyError}</Text>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={() => <View style={{ height: scale(20) }} />}
          ListFooterComponent={() => <View style={{ height: scale(20) }} />}
        />
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={themeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </View>
  );
};

export default BookmarkStations;

const styles = StyleSheet.create({
  txt: {
    fontSize: scale(16),
    marginTop: 16,
    textAlign: 'center',
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
