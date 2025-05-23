import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import Header from '../../components/Header';
import useThemeConstants from '../../hooks/useThemeConstants';
import ThemeConstant from '../../constants/ThemeConstant';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_Data from '../../constants/API_Data';

const Terms = () => {
  const themeConstant = useThemeConstants();
  const { selectedLanguage } = useSelector((state) => state.AppReducer);

  const [isTranslatesLoaded, setIsTranslatesLoaded] = useState(false);
  const initialTranslateObj = {
    termsText: 'Terms and Conditions',
    term1: `Acceptance of Terms: By accessing or using the EV charging station finding app ("the App"), you agree to
                  be bound by these Terms and Conditions.`,
    term2: `Use of the App: The App is provided for informational purposes only and does not guarantee the
                  availability, accuracy, or reliability of charging station locations. Users are solely responsible for
                  their use of the App and should exercise caution and discretion when relying on its information.`,
    term3: `Intellectual Property: All content, trademarks, and intellectual property rights associated with the App
                  are owned by the app developer or licensed to the developer. Users may not reproduce, modify, distribute,
                  or otherwise use any content from the App without prior written consent.`,
    term4: `Privacy: The App may collect and store user data for the purpose of improving the user experience and
                  providing personalized services. By using the App, you consent to the collection and use of your data in
                  accordance with our Privacy Policy.`,
    term5: `Limitation of Liability: The app developer shall not be liable for any direct, indirect, incidental,
                  special, or consequential damages arising out of the use or inability to use the App, including but not
                  limited to damages for loss of profits, goodwill, data, or other intangible losses.`,
    term6: `Modifications to Terms: The app developer reserves the right to modify or update these Terms and
                  Conditions at any time without prior notice. Users are responsible for reviewing the Terms periodically to
                  stay informed of any changes.`,
    termApp: `By using the App, you agree to abide by these Terms and Conditions. If you do not agree to these Terms, you
                  should not access or use the App.`,
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

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
      {isTranslatesLoaded ? (
        <>
          {/* Header */}
          <Header title={translateObj.termsText} />

          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
            <View style={{ gap: 20, paddingHorizontal: ThemeConstant.PADDING_MAIN }}>
              <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>
                {translateObj.termsText}
              </Text>
              <View style={{ gap: 10 }}>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>1. {translateObj.term1}</Text>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>2. {translateObj.term2}</Text>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>3. {translateObj.term3}</Text>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>4. {translateObj.term4}</Text>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>5. {translateObj.term5}</Text>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>6. {translateObj.term6}</Text>
                <Text style={{ color: themeConstant.TEXT_PRIMARY, fontSize: scale(14) }}>{translateObj.termApp}</Text>
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

export default Terms;

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
