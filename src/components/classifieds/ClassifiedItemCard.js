import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import ThemeConstant from '../../constants/ThemeConstant';
import { useNavigation } from 'expo-router';
import Routes from '../../constants/Routes';

const ClassifiedItemCard = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(Routes.CLASSIFIED_DETAIL, { classifield: JSON.stringify(item) });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer} onPress={handlePress}>
      <Image
        style={styles.img}
        resizeMode='cover'
        source={{
          uri:
            item.images && item.images.length > 0
              ? item.images[0]
              : 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym13JTIwY2FyfGVufDB8fDB8fHww',
        }}
      />

      <View style={styles.detailContainer}>
        <Text style={{ fontWeight: '700', fontSize: scale(14), color: '#000' }}>{item?.manufacturer?.name}</Text>
        <Text style={{ fontWeight: '700', fontSize: scale(16), color: ThemeConstant.PRIMARY_COLOR }}>
          {item?.model?.name}
        </Text>
        {item?.body && (
          <Text style={{ fontWeight: '400', fontSize: scale(8), color: '#000', opacity: 0.5 }}>{item?.body}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ClassifiedItemCard;

const styles = StyleSheet.create({
  cardContainer: {
    // height: moderateVerticalScale(129),
    width: moderateScale(150),
    backgroundColor: '#fff',
    padding: scale(4),
    position: 'relative',
    borderRadius: scale(10),
    gap: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
    marginBottom: moderateVerticalScale(2),
  
  },
  img: {
    width: '100%',
    height: moderateScale(80),
    borderRadius: scale(10),
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  iconContainer: {
    position: 'absolute',
    top: scale(10),
    right: scale(15),
  },
});
