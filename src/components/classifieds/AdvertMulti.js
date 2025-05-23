import React, { useState } from 'react';
import { View, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';

import ThemeConstant from '../../constants/ThemeConstant';

const AdvertMulti = ({ advertisments, showRemove = false }) => {
  const { width } = useWindowDimensions();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      {!showAdd && (
        <View
          style={{
            width: width.toFixed(0) - scale(60),
            marginLeft: 'auto',
            marginRight: 'auto',
            height: moderateScale(90),
            borderWidth: 1,
            borderColor: '#d5d5d5',
          }}
        >
          <Carousel
            width={width.toFixed(0) - scale(60)}
            height={'100%'}
            data={advertisments}
            autoPlay={true}
            autoPlayInterval={3500}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ item, index }) => (
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                }}
                source={{ uri: item.pic }}
              />
            )}
          />

          {showRemove ? (
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
          ) : null}
        </View>
      )}
    </>
  );
};

export default AdvertMulti;
