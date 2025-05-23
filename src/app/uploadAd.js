import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateVerticalScale, scale } from 'react-native-size-matters'
import BackButton from '../components/BackButton'
import { showMessage } from 'react-native-flash-message'
import CustomButton from '../components/CustomButton'
import { router } from 'expo-router'
import Header from '../components/Header'
import ThemeConstant from '../constants/ThemeConstant'
import useThemeConstants from '../hooks/useThemeConstants'

const UploadAd = () => {

    const themeConstant = useThemeConstants();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [website, setWebsite] = useState('');

    const handleSubmit = () => {
        if (!email || !mobile || !businessName || !website) {
            showMessage({ message: 'Error', description: 'All fields are required!', type: 'danger', duration: 3000 })
            return
        }

        try {
            setIsLoading(true)

            setTimeout(() => {
                showMessage({ message: 'Success', description: 'Ad has been successfully posted!', type: 'success', duration: 3000 })
                setIsLoading(false)
                router.back()
            }, 1500);
        } catch (error) {
            setIsLoading(false)
            console.log("Error in posting new ad!", error);
        }
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeConstant.THEME }]}>
            {/* Header */}
            <Header title='Post an Advertisement' />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: ThemeConstant.PADDING_MAIN, paddingBottom: 40, marginTop: moderateVerticalScale(28) }}>
                <View style={{ flex: 1, gap: 28 }}>
                    {/* FEEDBACK */}
                    <View style={{
                        borderWidth: 1,
                        borderColor: ThemeConstant.FADED_BLACK,
                        height: moderateVerticalScale(50),
                        padding: scale(10),
                        borderRadius: scale(5)
                    }}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder='Email'
                            placeholderTextColor={themeConstant.FADED_BLACK}
                            keyboardType='email-address'
                            style={{
                                flex: 1,
                                textAlignVertical: 'top',
                                color: themeConstant.TEXT_PRIMARY
                            }}
                        />
                    </View>

                    <View style={{
                        borderWidth: 1,
                        borderColor: ThemeConstant.FADED_BLACK,
                        height: moderateVerticalScale(50),
                        padding: scale(10),
                        borderRadius: scale(5)
                    }}>
                        <TextInput
                            value={mobile}
                            onChangeText={setMobile}
                            placeholder='Mobile No.'
                            placeholderTextColor={themeConstant.FADED_BLACK}
                            keyboardType='number-pad'
                            style={{
                                flex: 1,
                                textAlignVertical: 'top',
                                color: themeConstant.TEXT_PRIMARY
                            }}
                        />
                    </View>

                    <View style={{
                        borderWidth: 1,
                        borderColor: ThemeConstant.FADED_BLACK,
                        height: moderateVerticalScale(50),
                        padding: scale(10),
                        borderRadius: scale(5)
                    }}>
                        <TextInput
                            value={businessName}
                            onChangeText={setBusinessName}
                            placeholder='Business Name'
                            placeholderTextColor={themeConstant.FADED_BLACK}
                            style={{
                                flex: 1,
                                textAlignVertical: 'top',
                                color: themeConstant.TEXT_PRIMARY
                            }}
                        />
                    </View>

                    <View style={{
                        borderWidth: 1,
                        borderColor: ThemeConstant.FADED_BLACK,
                        height: moderateVerticalScale(50),
                        padding: scale(10),
                        borderRadius: scale(5)
                    }}>
                        <TextInput
                            value={website}
                            onChangeText={setWebsite}
                            placeholder='Website'
                            placeholderTextColor={themeConstant.FADED_BLACK}
                            style={{
                                flex: 1,
                                textAlignVertical: 'top',
                                color: themeConstant.TEXT_PRIMARY
                            }}
                        />
                    </View>

                    <View style={{ flex: 1 }} />

                    <CustomButton onPress={handleSubmit} title={'Post an Advertisement'} loading={isLoading} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UploadAd

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: ThemeConstant.PADDING_MAIN,
        position: 'relative'
    },
})