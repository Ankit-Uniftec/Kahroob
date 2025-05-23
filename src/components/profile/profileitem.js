import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters';
import useThemeConstants from '../../hooks/useThemeConstants';

const Profileitem = ({ name, onClick = () => { } }) => {
    const themeConstant = useThemeConstants();

    return (
        <TouchableOpacity onPress={onClick} activeOpacity={0.8} style={styles.main}>
            <Text style={[styles.title, { color: themeConstant.TEXT_PRIMARY }]}>{name}</Text>
            <Image source={require('../../../assets/back-icon.png')} resizeMode='contain'
                style={[styles.image, { tintColor: themeConstant.TEXT_PRIMARY }]}
            />
        </TouchableOpacity>
    )
}

export default Profileitem

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: '600',
        fontSize: scale(16)
    },
    image: {
        width: scale(16),
        height: scale(16),
        transform: [{ rotate: '180deg' }],
    }
})