import {useNavigation} from '@react-navigation/native';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const HeaderBarsButton = (props: HeaderBackButtonProps) => {
  const navigation = useNavigation();

  return (
    //  For some reason, on physical devices, onPress does not work for the navigation in this case.
    //  I'm using onPressIn for now until we figure out why it doesn't work.

    <TouchableOpacity
      onPressIn={() => (props.canGoBack ? navigation.goBack() : null)}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 15}}>
      <FontAwesome5 name="bars" style={styles.backButton} size={38} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {color: '#0078D7', fontSize: 30},
});
