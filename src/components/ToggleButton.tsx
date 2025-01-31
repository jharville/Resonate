import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';

export const ToggleButton = ({
  buttonOptions,
  selectedOption,
  onSelectOption,
}: ToggleButtonProps) => {
  return (
    <View style={styles.forecastTextAndButtons}>
      <View style={styles.daySelectorContainer}>
        {buttonOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            hitSlop={12}
            style={selectedOption === option ? styles.selectedButton : styles.button}
            onPress={() => onSelectOption(option)}>
            <Text style={styles.paramText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const baseButtonStyle: ViewStyle = {
  flexDirection: 'row',
  borderRadius: 8,
  borderWidth: 3,
  backgroundColor: '#afb0b7',
  maxWidth: 100,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 5,
};

const selectedButtonStyle: ViewStyle = {
  ...baseButtonStyle,
  backgroundColor: '#196cf1',
};

const styles = StyleSheet.create({
  forecastTextAndButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    backgroundColor: '#1b4a7c',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },

  button: baseButtonStyle,
  selectedButton: selectedButtonStyle,

  paramText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

type ToggleButtonProps = {
  buttonOptions: string[]; // Array of button options (e.g., ["Summary", "Hourly"])
  selectedOption: string; // Currently selected option
  onSelectOption: (selectedOption: string) => void; // Callback function when an option is selected
};
