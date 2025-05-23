import { Image, StyleSheet, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import SearchIcon from '../../assets/search_icon.png';
import { moderateVerticalScale, scale } from 'react-native-size-matters';

import { useDispatch } from 'react-redux';

const GoogleSearchBar = ({ placeholder, updateSelectedLocation, country = '' }) => {
  const dispatch = useDispatch();

  var shouldDisplayListView = true;
  const MAX_NAME_LENGTH = 28;

  const handleSelectPlace = (location) => {
    updateSelectedLocation(location);
  };

  const truncateName = (name, maxLength) => {
    if (name.length <= maxLength) return name;
    return `${name.slice(0, maxLength - 1)}...`;
  };

  return (
    <View style={styles.container}>
      <Image source={SearchIcon} style={styles.icon} />
      <GooglePlacesAutocomplete
        listViewDisplayed={shouldDisplayListView}
        keyboardShouldPersistTaps={'always'}
        fetchDetails={true}
        debounce={200}
        textInputProps={{
          onFocus: () => {},
          onBlur: () => {},
        }}
        enableHighAccuracyLocation={true}
        enablePoweredByContainer={false}
        placeholder={placeholder}
        onPress={(data, details = null) => {
          const { lat, lng } = details.geometry.location;
          handleSelectPlace({ latitude: lat, longitude: lng });
        }}
        query={{
          key: 'AIzaSyCKFKjyPUloNMA_aF0UN6n5kdUIUAjNK-0',
          language: 'en',
          // components: `country:${country}`,
        }}
        renderRow={(data) => (
          <View>
            <Text style={styles.title}>{truncateName(data.structured_formatting.main_text, MAX_NAME_LENGTH)}</Text>
            <Text style={styles.address}>
              {data.description.length > 30 ? data.description.slice(0, 30) + '...' : data.description}
            </Text>
          </View>
        )}
        styles={{
          textInput: {
            paddingLeft: 40,
            borderRadius: scale(25),
            height: scale(50),
            borderWidth: 2,
            borderColor: '#e4e4e4',
          },
          container: {
            // backgroundColor: 'red'
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: scale(14),
          },
          row: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </View>
  );
};

export default GoogleSearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  icon: {
    width: scale(20),
    height: scale(20),
    position: 'absolute',
    zIndex: 999,
    left: 14,
    top: moderateVerticalScale(16),
  },
});
