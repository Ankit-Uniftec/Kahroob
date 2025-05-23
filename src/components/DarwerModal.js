import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import ThemeConstant from '../constants/ThemeConstant';
import DrawerMenuItem from './DrawerMenuItem';
import Line from './profile/line';
import { router } from 'expo-router';
import Routes from '../constants/Routes';
import useThemeConstants from '../hooks/useThemeConstants';

const DrawerModal = ({ open = false, setOpen = () => null }) => {
    const themeConstant = useThemeConstants();

    const navigateToAbout = () => {
        router.push(`${Routes.ABOUT_US}`)
        setOpen(false)
    }
    const navigateToTips = () => {
        router.push(`${Routes.TIPS_TRICKS}`)
        setOpen(false)
    }
    const navigateToAdvertise = () => {
        router.push(`${Routes.UPLOAD_AD}`)
        setOpen(false)
    }
    const navigateToContactUs = () => {
        router.push(`${Routes.CONTACT_US}`)
        setOpen(false)
    }
    const navigateToSettings = () => {
        router.push(`${Routes.SETTINGS}`)
        setOpen(false)
    }

    return (
        <Modal
            statusBarTranslucent
            animationType="fade"
            transparent={true}
            visible={open}
            onRequestClose={() => setOpen(false)}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.drawerContent, { backgroundColor: themeConstant.THEME }]}>
                    <View style={styles.menuHead}>
                        <Text style={{ fontWeight: '700', fontSize: scale(20) }}>Menu</Text>
                        <TouchableOpacity onPress={() => setOpen(false)}>
                            <Entypo name="cross" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        paddingHorizontal: ThemeConstant.PADDING_MAIN,
                        gap: scale(10)
                    }}>
                        <DrawerMenuItem name={'About us'} onClick={navigateToAbout} />
                        <Line />
                        <DrawerMenuItem name={'Tips & Tricks '} onClick={navigateToTips} />
                        <Line />
                        <DrawerMenuItem name={'Advertise with us'} onClick={navigateToAdvertise} />
                        <Line />
                        <DrawerMenuItem name={'Contact us'} onClick={navigateToContactUs} />
                        <Line />
                        <DrawerMenuItem name={'Settings'} onClick={navigateToSettings} />
                        <Line />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawerContent: {
        width: '85%',
        height: '100%',
        paddingTop: scale(40),
        gap: scale(14)
    },
    menuHead: {
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scale(18),
        paddingHorizontal: ThemeConstant.PADDING_MAIN
    }
});

export default DrawerModal;
