import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';

import ThemeConstant from '../../constants/ThemeConstant';

const Advert = ({ url, autoClose = false }) => {
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        setShowAdd(true);
      }, 5000);
    }
  }, []);

  return (
    <>
      {!showAdd && (
        <View
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: moderateScale(300),
            height: moderateScale(300),
            borderWidth: 1,
            borderColor: '#d5d5d5',
          }}
        >
          <Image
            style={{
              width: '100%',
              height: '100%',
            }}
            source={{ uri: url }}
          />

          <TouchableOpacity
            onPress={() => setShowAdd(true)}
            style={{
              width: scale(20),
              height: scale(20),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: ThemeConstant.PRIMARY_COLOR,
              borderRadius: scale(50),
              position: 'absolute',
              right: -5,
              top: -10,
            }}
          >
            <Entypo name='cross' size={20} color={ThemeConstant.BLACK} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Advert;
