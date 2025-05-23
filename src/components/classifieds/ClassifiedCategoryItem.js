import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { scale } from 'react-native-size-matters'
import ThemeConstant from '../../constants/ThemeConstant'
import { MaterialCommunityIcons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

const ClassifiedsCategoryItem = ({ category, selected, iconName, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.categoryContainer]}>
            <MaterialCommunityIcons name={iconName} size={scale(24)} color={ThemeConstant.PRIMARY_COLOR} />
            <Text style={{ textAlign: 'center', color: '#000', fontSize: scale(12), fontWeight: '400' }}>{category}</Text>
        </TouchableOpacity>
    )
}

export default ClassifiedsCategoryItem;

const styles = StyleSheet.create({
    categoryContainer: {
        width: '31%',
        height: width * 0.31,
        // aspectRatio: 1 / 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: scale(5),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        // borderWidth: 1,
        elevation: 1,
        gap: 10
    }
})