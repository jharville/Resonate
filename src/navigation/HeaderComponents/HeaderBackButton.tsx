import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

export const HeaderBackButton = () => {
  const navigation = useNavigation();
  const route = useRoute();

  if (route.name === 'CollectionScreen') {
    return null;
  }
  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.wholeContainer}>
      <TouchableOpacity onPress={handlePress} hitSlop={{top: 8, bottom: 8, left: 15, right: 0}}>
        <Ionicons name="chevron-back" size={35} color="#fff" style={styles.backButtonStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'center',
  },
  backButtonStyle: {
    color: 'white',
    marginLeft: -10,
    marginRight: 0,
  },
});
