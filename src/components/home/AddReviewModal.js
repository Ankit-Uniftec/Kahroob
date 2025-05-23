// DrawerModal.js
import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import ThemeConstant from '../../constants/ThemeConstant';
import CustomButton from '../CustomButton';
import StarRating from './StartRating';
import ImagePickerComp from './ImagePickerComp';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_Data from '../../constants/API_Data';

const AddReviewModal = ({ isVisible, setIsVisible, EVStation }) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(null);
  const [image, setImage] = useState('');

  const { user } = useSelector((state) => state.AuthReducer);
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    addReviewText: 'Add Review',
    letUsKnowTest: 'Please let us know your thoughts.',
    writeFeedbackText: 'Write feedback',
  };
  const [translateObj, setTranslateObj] = useState(initialTranslateObj);

  useEffect(() => {
    getTranslatedData();
    setMessage('')
    setRating(null)
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

  const _handleReviewSubmit = async () => {
    console.log('adding review');
    if (message && rating) {
      try {
        const response = await axios.post(
          API_Data.url + '/reviews',
          {
            type: 'station',
            title: EVStation?.displayName?.text,
            address: EVStation?.formattedAddress,
            rating: rating,
            detail: message,
          },
          {
            headers: { ...API_Data.getHeaders(user, selectedLanguage) },
          }
        );
        if (response.data && response.data.isSuccess) {
          setIsVisible(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Modal animationType='fade' transparent={true} visible={isVisible} onRequestClose={() => setIsVisible(false)}>
      {isTranslatesLoaded ? (
        <>
          <View style={styles.overlay} />

          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.drawerContent} onPress={Keyboard.dismiss} activeOpacity={1}>
              {/* TOP */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ gap: scale(10) }}>
                  <Text style={{ fontWeight: '700', fontSize: scale(16) }}>{translateObj.addReviewText}</Text>
                  <Text style={{ fontWeight: '400', fontSize: scale(12) }}>{translateObj.letUsKnowTest}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <Entypo name='cross' size={26} color='black' />
                </TouchableOpacity>
              </View>

              {/* STARS */}
              <View>
                <StarRating rating={rating} setRating={setRating} />
              </View>

              {/* FEEDBACK */}
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
                    if (txt.length <= 200) {
                      setMessage(txt);
                    }
                  }}
                  multiline
                  numberOfLines={100}
                  placeholder={translateObj.writeFeedbackText}
                  maxLength={200}
                  style={{
                    flex: 1,
                    textAlignVertical: 'top',
                  }}
                />
              </View>

              {/* UPLOAD IMAGE */}
              {/* <ImagePickerComp image={image} setImage={setImage} /> */}
              <CustomButton title={'Submit'} onPress={_handleReviewSubmit} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={[styles.loaderContainer, styles.loaderHorizontal]}>
          <ActivityIndicator size='large' color={ThemeConstant.PRIMARY_COLOR}></ActivityIndicator>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContent: {
    width: '85%',
    backgroundColor: 'white',
    gap: scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    borderRadius: scale(10),
    padding: ThemeConstant.PADDING_MAIN,
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

export default AddReviewModal;
