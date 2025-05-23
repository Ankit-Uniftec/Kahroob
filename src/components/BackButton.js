import { useEffect } from 'react';
import { TouchableOpacity, Image, BackHandler } from 'react-native'
import { router } from 'expo-router'
import { scale } from 'react-native-size-matters';
import useThemeConstants from '../hooks/useThemeConstants';

const BackButton = ({ color = "" }) => {
    const themeConstant = useThemeConstants();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
            return true;
        }
        return false;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
        return () => backHandler.remove();
    }, []);

    return (
        <TouchableOpacity onPress={handleBack}
            style={{
                height: 40,
                width: 40,
                justifyContent: 'center'
            }}>
            <Image source={require('../../assets/back-icon.png')} resizeMode='contain'
                style={{ height: scale(16), width: scale(16), tintColor: color || themeConstant.TEXT_PRIMARY }}
            />
        </TouchableOpacity>
    )
}

export default BackButton