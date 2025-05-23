import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import ThemeConstant from '../constants/ThemeConstant';
import { scale } from 'react-native-size-matters';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry = false, iconname = null, iconStyle = {}, ...rest }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            {iconname !== null && <AntDesign name={iconname} size={scale(18)} color={'#00000033'} style={iconStyle} />}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                placeholderTextColor='#00000033'
                {...rest}
            />
            {secureTextEntry && (
                <TouchableOpacity style={styles.eyeButton} onPress={togglePasswordVisibility}>
                    <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={scale(18)} color={ThemeConstant.FADED_BLACK} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: scale(50),
        borderColor: '#00000033',
        borderWidth: 1,
        width: '100%',
        paddingLeft: 10,
        borderRadius: 4
    },
    input: {
        fontSize: scale(16),
        flex: 1,
        paddingLeft: 8,
        height: '100%'
    },
    eyeButton: {
        padding: 10,
    },
});

export default InputField;
