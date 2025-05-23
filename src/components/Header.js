import { Text, View } from 'react-native'
import useThemeConstants from '../hooks/useThemeConstants';
import BackButton from './BackButton';
import { scale } from 'react-native-size-matters';
import ThemeConstant from '../constants/ThemeConstant';

const Header = ({ title, onBack = () => { } }) => {
    const themeConstant = useThemeConstants();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), paddingVertical: 14, paddingHorizontal: ThemeConstant.PADDING_MAIN, }}>
            <BackButton />
            <Text style={{ color: themeConstant.TEXT_PRIMARY, fontWeight: '600', fontSize: scale(20) }}>{title}</Text>
        </View>
    )
}

export default Header