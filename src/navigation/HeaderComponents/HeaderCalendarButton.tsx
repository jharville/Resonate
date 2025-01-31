import {HeaderCalendarButtonProps} from '../types/headerComponent.types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// This file is unused for *now*. Please ignore.
export const HeaderCalendarButton = (props: HeaderCalendarButtonProps) => {
  return (
    <TouchableOpacity onPressIn={() => null}>
      <FontAwesome name="calendar" size={30} color="white" style={styles.calendarButton} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  calendarButton: {
    color: 'white',
    fontSize: 38,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
