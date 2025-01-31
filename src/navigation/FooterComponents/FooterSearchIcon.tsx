import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

export const FooterSearchIcon = ({onPressIcon}: FooterSearchIconProps) => {
  const [wasPressed, setWasPressed] = useState(false);

  const handlePress = () => {
    setWasPressed(!wasPressed);
    onPressIcon();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <FontAwesomeIcon
        name="search"
        size={30}
        color={wasPressed ? 'white' : 'grey'}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 34,
    transform: [{scaleX: -1}],
  },
});

type FooterSearchIconProps = {
  onPressIcon: () => void;
};
