import { ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateVerticalScale, scale } from 'react-native-size-matters';
import { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';
import StarRating from '../../components/home/StartRating';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import useThemeConstants from '../../hooks/useThemeConstants';
import ThemeConstant from '../../constants/ThemeConstant';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_Data from '../../constants/API_Data';

const Feedback = () => {
  const themeConstant = useThemeConstants();
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(null);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    feedbackText: 'Feedback',
    rateUsText: 'Rate us',
    howAreWeDoingText: 'How we are doing?',
    writeFeedbackText: 'Write feedback',
    submitText: 'Submit',
    allFieldError: 'All fields are required!',
    errorText: 'Error',
    feedbackSuccessText: 'Your feedback has been successfully submited!',
    successText: 'Success',
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

  const handleSubmit = () => {
    if (!rating || !message) {
      showMessage({
        message: translateObj.errorText,
        description: translateObj.allFieldError,
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        showMessage({
          message: translateObj.successText,
          description: translateObj.feedbackSuccessText,
          type: 'success',
          duration: 3000,
        });
        router.back();
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.log('getting error in feedback', error);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.feedbackText} />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              gap: 30,
              paddingBottom: 30,
              paddingHorizontal: ThemeConstant.PADDING_MAIN,
            }}
          >
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
                {translateObj.rateUsText}
              </Text>
              <Text style={{ fontSize: scale(14), fontWeight: '500', color: themeConstant.TEXT_PRIMARY }}>
                {translateObj.howAreWeDoingText}
              </Text>
            </View>

            <View>
              <StarRating rating={rating} setRating={setRating} />
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
                  color: themeConstant.TEXT_PRIMARY,
                }}
              />
            </View>

            <View style={{ flex: 1 }} />

            <CustomButton title={translateObj.submitText} onPress={handleSubmit} loading={isLoading} />
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

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
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
