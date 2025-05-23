import { StyleSheet, View, TextInput, Image } from 'react-native'
import { scale } from 'react-native-size-matters';
import SearchIcon from '../../assets/search_icon.png'
import useThemeConstants from '../hooks/useThemeConstants';

const Search = ({ placeholder, value, setValue, onSearch }) => {
    const themeConstant = useThemeConstants();

    return (
        <View style={styles.container}>
            <Image source={SearchIcon} style={[styles.icon, { tintColor: themeConstant.FADED_BLACK }]} />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={themeConstant.FADED_BLACK}
                value={value}
                onChangeText={setValue}
                style={[styles.txt, { color: themeConstant.TEXT_PRIMARY }]}
            />
        </View>
    )
}

export default Search;

const styles = StyleSheet.create({
    container: {
        height: scale(50),
        borderWidth: 2,
        borderColor: '#e4e4e4',
        borderRadius: scale(25),
        justifyContent: 'center'
    },
    txt: {
        height: '100%',
        width: '100%',
        paddingLeft: 40
    },
    icon: {
        width: scale(20),
        height: scale(20),
        position: 'absolute',
        zIndex: 999,
        left: 14,
    }
})