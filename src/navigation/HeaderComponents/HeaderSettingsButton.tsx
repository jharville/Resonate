import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {StyleSheet, TouchableOpacity} from 'react-native';

export const HeaderSettingsButton = (props: HeaderButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => (props.canGoBack ? navigation.goBack() : null)}>
      <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingsButtonStyle: {color: 'white', fontSize: 38},
});
