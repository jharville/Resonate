import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from 'react-native';

export const ToggleButton = ({
  buttonOptions,
  onSelectOption,
  buttonStyle,
  selectedButtonStyle,
  textStyle,
  selectedTextStyle,
  containerStyle,
}: ToggleButtonProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelectOption(option);
  };

  return (
    <View style={styles.forecastTextAndButtons}>
      <View style={[styles.optionSelectorContainer, containerStyle]}>
        {buttonOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            hitSlop={12}
            style={[
              selectedOption === option ? styles.selectedButton : styles.button,
              selectedOption === option ? selectedButtonStyle : buttonStyle,
            ]}
            onPress={() => handleSelect(option)}>
            <Text
              style={[
                selectedOption === option ? styles.selectedText : styles.paramText,
                selectedOption === option ? selectedTextStyle : textStyle,
              ]}>
              {option}
            </Text>
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

  optionSelectorContainer: {
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

  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

type ToggleButtonProps = {
  buttonOptions: string[]; // Array of button options (e.g., ["Summary", "Hourly"])
  onSelectOption: (selectedOption: string) => void; // Callback function when an option is selected
  buttonStyle?: ViewStyle; // Custom styling for buttons
  selectedButtonStyle?: ViewStyle; // Custom styling for selected button
  textStyle?: TextStyle; // Custom styling for text
  selectedTextStyle?: TextStyle; // Custom styling for selected text
  containerStyle?: ViewStyle; // Custom styling for the button container
};
