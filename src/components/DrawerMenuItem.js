import { Text, TouchableOpacity, Image } from 'react-native'
import { scale } from 'react-native-size-matters';
import useThemeConstants from '../hooks/useThemeConstants';

const DrawerMenuItem = ({ name, onClick = function () { } }) => {
    const themeConstant = useThemeConstants();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClick}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
            <Text style={{ fontSize: scale(14), fontWeight: '700', color: themeConstant.TEXT_PRIMARY }}>{name}</Text>
            <Image source={require('../../assets/back-icon.png')} resizeMode='contain'
                style={{ height: scale(16), width: scale(16), tintColor: themeConstant.TEXT_PRIMARY, transform: [{ rotate: '180deg' }] }}
            />
        </TouchableOpacity>
    )
}

export default DrawerMenuItem