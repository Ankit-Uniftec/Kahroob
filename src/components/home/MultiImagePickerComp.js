import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../constants/ThemeConstant';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../CustomButton';

const MultiImagePickerComp = ({ images, setImages, translateObj }) => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImages([...images, { uri: result.assets[0].uri, name: result.assets[0].fileName, type: result.assets[0].type }]);
    }
  };

  return (
    <View>
      <TouchableOpacity style={{ marginBottom: scale(10) }} onPress={pickImage}>
        <View style={styles.singleImagePickerContainer}>
          {images[0] ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  let imagesObj = [...images];
                  imagesObj.splice(0, 1);
                  setImages(imagesObj);
                }}
                style={styles.iconContainer}
              >
                <FontAwesome name={'trash'} size={15} color={ThemeConstant.PRIMARY_COLOR} />
              </TouchableOpacity>
              <Image source={{ uri: images[0].uri }} style={styles.imagePreview} />
            </>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: scale(12), color: ThemeConstant.PRIMARY_COLOR }}>
                {translateObj.clickUploadText}
              </Text>
              <Text style={{ fontWeight: '400', fontSize: scale(8), color: ThemeConstant.FADED_BLACK }}>
                {translateObj.typeSupportText}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {images.length > 1 && (
        <FlatList
          scrollEnabled={false}
          style={{
            marginTop: scale(5),
            paddingHorizontal: 1,
            paddingVertical: 2,
          }}
          data={images.slice(1, images.length)}
          numColumns={2}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={pickImage}>
              <TouchableOpacity
                onPress={() => {
                  let imagesObj = [...images];
                  imagesObj.splice(index + 1, 1);
                  setImages(imagesObj);
                }}
                style={styles.iconContainer}
              >
                <FontAwesome name={'trash'} size={15} color={ThemeConstant.PRIMARY_COLOR} />
              </TouchableOpacity>
              <View
                style={{ ...styles.imagePickerContainer, ...{ marginLeft: (index + 1) % 2 == 0 ? scale(5) : scale(0) } }}
              >
                {item ? <Image source={{ uri: item.uri }} style={styles.imagePreview} /> : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {images.length > 0 && <CustomButton title={translateObj.addMoreImagesText} onPress={pickImage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignItems: 'center',
    width: (Dimensions.get('screen').width - 60) / 2,
    height: scale(60),
    borderRadius: scale(10),
    marginBottom: scale(10),
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: scale(8),
  },
  iconContainer: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    zIndex: 999,
    backgroundColor: ThemeConstant.BLACK,
    borderRadius: scale(50),
    padding: scale(5),
  },
  singleImagePickerContainer: {
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateVerticalScale(120),
    borderRadius: scale(5),
  },
});

export default MultiImagePickerComp;
