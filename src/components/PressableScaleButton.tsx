import React from 'react';
import {Pressable, PressableProps, StyleProp, ViewStyle} from 'react-native';

/**
 * A scalable pressable button component that shrinks when pressed.
 * Simply wrap whatever children components in PressableScaleButton
 * and define a required scale in props. This also accepts an optional style prop.
 *
 * @param {number} scale - The scale value applied when the button is pressed.
 * @param {StyleProp<ViewStyle>} [style] - Optional styles to apply to the button.
 * @param {() => void} [onPress] - Function to call when the button is pressed.
 */

export const PressableScaleButton = ({scale, style, children, onPress}: TouchableButtonProps) => {
  return (
    <Pressable
      onPress={() => {
        onPress?.(); // this calls the onPress function
      }}
      style={({pressed}) => [style, {transform: [{scale: pressed ? scale : 1}]}]}>
      {children}
    </Pressable>
  );
};

type TouchableButtonProps = PressableProps & {
  scale: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
