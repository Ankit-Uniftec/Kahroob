import { Image, View, StyleSheet, Text, TouchableOpacity, Pressable, Platform, Modal } from 'react-native';
import { Tabs, router } from 'expo-router';
import { moderateScale, scale } from 'react-native-size-matters';

import ThemeConstant from '../../constants/ThemeConstant';
import Routes from '../../constants/Routes';

import tabImage1 from '../../../assets/Frame-7.png';
import tabImage1Active from '../../../assets/Frame-6.png';

import tabImage2 from '../../../assets/Frame-2.png';
import tabImage2Active from '../../../assets/Frame-3.png';

import tabImage3 from '../../../assets/Frame-4.png';
import tabImage3Active from '../../../assets/Frame.png';

import tabImage4 from '../../../assets/Frame-5.png';
import tabImage4Active from '../../../assets/Frame-1.png';

import tabImage5Active from '../../../assets/Frame-8.png';

import useThemeConstants from '../../hooks/useThemeConstants';
import useAppConstants from '../../hooks/useAppConstants';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TabsLayout = (state) => {
  let activeColor = ThemeConstant.PRIMARY_COLOR;
  const [modalVisible, setModalVisible] = useState(false);

  const themeConstant = useThemeConstants();

  const { homeRoute, isKeyboardOpen } = useAppConstants();

  const [showAdd, setShowAdd] = useState(true);

  useEffect(() => { }, [homeRoute]);

  const iconSize = scale(20); // Set a consistent icon size

  return (
    <>
      {showAdd && isKeyboardOpen == 'show' && (
        <Pressable
          onPress={() => {
            router.push(Routes.ADD_ITEM);
            // setModalVisible(!modalVisible);
          }}
          style={{
            borderColor: activeColor,
            borderWidth: scale(1),
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 99,
            bottom: Platform.OS == 'android' ? scale(46) : scale(46),
            alignSelf: 'center',
            shadowColor: 'black',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 3,
            padding: 15,
            borderRadius: 100,
          }}
        >
          <Image source={tabImage5Active} style={[styles.iconPlus, { width: scale(20), height: scale(20) }]} />
        </Pressable>
      )}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            width: moderateScale(60),
          },
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: scale(70), // Increase the height of the tab bar
            paddingTop: 0,
            paddingBottom: scale(10), // Add some padding at the bottom
          },
        }}
        screenListeners={{
          focus: (e) => {
            if (e.target.includes(Routes.PROFILE)) {
              setShowAdd(false);
            } else {
              setShowAdd(true);
            }
          },
        }}
      >
        <Tabs.Screen
          name={Routes.HOEM_TAB}
          options={{
            tabBarIconStyle: {
              borderTopWidth: 1,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <View style={[styles.tab, focused && styles.activeTab]}>
                  <Image source={focused ? tabImage1Active : tabImage1} style={[styles.icon, { width: iconSize, height: 22 }]} />
                  <Text style={[styles.iconLabel, focused && styles.activeIconLabel]}>Maps</Text>
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name={Routes.CLASSIFIED_TAB}
          options={{
            tabBarIconStyle: {
              borderTopWidth: 1,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={[styles.tab, focused && styles.activeTab]}
                >
                  <Image source={focused ? tabImage2Active : tabImage2} style={[styles.icon, { width: iconSize, height: iconSize }]} />
                  <Text style={[styles.iconLabel, focused && styles.activeIconLabel]}>Classifieds</Text>
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name={Routes.BOOKMARK}
          options={{
            tabBarIconStyle: {
              borderTopWidth: 1,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={[styles.tab, focused && styles.activeTab]}
                >
                  <Image source={focused ? tabImage3Active : tabImage3} style={[styles.icon, { width: iconSize, height: iconSize }]} />
                  <Text style={[styles.iconLabel, focused && styles.activeIconLabel]}>Favorites</Text>
                </View>
              );
            },
          }}
        />
        <Tabs.Screen
          name={Routes.PROFILE}
          options={{
            tabBarIconStyle: {
              borderTopWidth: 1,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <View style={[styles.tab, focused && styles.activeTab]}>
                  <Image source={focused ? tabImage4Active : tabImage4} style={[styles.icon, { width: iconSize, height: iconSize }]} />
                  <Text style={[styles.iconLabel, focused && styles.activeIconLabel]}>Menu</Text>
                </View>
              );
            },
          }}
        />
      </Tabs>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity style={styles.centeredView} onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.modalView}>
            {/* add EV station */}
            <View style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Pressable
                style={[styles.button, { backgroundColor: themeConstant.PRIMARY_COLOR }]}
                onPress={() => {
                  router.push(Routes.ADD_EV_STATIONS);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Add EV Station</Text>
              </Pressable>
            </View>
            {/* Add Classified Item */}
            <View style={{ marginTop: 10, width: '100%' }}>
              <Pressable
                style={[styles.button, { backgroundColor: themeConstant.PRIMARY_COLOR }]}
                onPress={() => {
                  router.push(Routes.ADD_CLLASSIFIED);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Add Classified Item</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  activeTab: {
    borderTopColor: ThemeConstant.PRIMARY_COLOR,
  },
  activeIconLabel: {
    color: ThemeConstant.PRIMARY_COLOR,
    fontWeight: 'bold',
  },


  middleIcons: {},
  icon: {
    width: scale(28),
    height: scale(28),
    marginTop: scale(10), // Add some top margin to the icon
  },
  iconPlus: { width: scale(20), height: scale(20) },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  iconLabel: {
    marginTop: 4,
    fontSize: scale(10),
    color: 'black',
    textAlign: 'center',
  },
});
