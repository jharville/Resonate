import {useNavigation} from '@react-navigation/native';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const HeaderAccountButton = (props: HeaderBackButtonProps) => {
  const navigation = useNavigation();

  return (
    //  For some reason, on physical devices, onPress does not work for the navigation in this case.
    //  I'm using onPressIn for now until we figure out why it doesn't work.

    <TouchableOpacity
      onPressIn={() => (props.canGoBack ? navigation.goBack() : null)}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 15}}>
      <Ionicons name="person" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {color: 'white'},
});
