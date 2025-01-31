import React, {useCallback, useState} from 'react';
import {TextInput, View, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {CustomAddressAutofill} from './CustomAddressAutofill';

/**
 * SearchCity is a search bar component that has props for handling 3 different submits and setting user input.
 * It is responsible for the autofill suggestions.
 * It is not responsible for the weather fetch itself.
 */
export const SearchCity: React.FC<SearchCityProps> = ({
  handleSearch,
  handleSuggestionClick,
  userTextInput,
  setUserTextInput,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const setFocusStateTrue = useCallback(() => {
    setIsFocused(true);
  }, []);

  const setFocusStateFalse = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <>
      <View style={styles.searchbarAndAutofill}>
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBarInput, {borderColor: isFocused ? 'white' : '#949ba0'}]}>
            <View style={styles.textFieldContainer}>
              <TextInput
                autoComplete="off"
                style={styles.textField}
                value={userTextInput}
                onChangeText={setUserTextInput}
                spellCheck={true}
                placeholder="Search"
                onFocus={setFocusStateTrue}
                onBlur={setFocusStateFalse}
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                numberOfLines={1}
                onSubmitEditing={handleSearch}
                cursorColor="white"
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <FontAwesomeIcon
                name="search"
                size={30}
                color={isFocused ? 'white' : 'grey'}
                style={styles.icon}
                onPress={handleSearch}
              />
            </TouchableOpacity>
          </View>
        </View>
        <CustomAddressAutofill
          onAcceptedSuggestion={handleSuggestionClick}
          onNotSuggestionSubmit={handleSearch}
          searchedCity={userTextInput}
        />
      </View>
    </>
  );
};

interface SearchCityProps {
  handleSearch: () => void;
  handleSuggestionClick: (suggestion: string) => void;
  userTextInput: string;
  setUserTextInput: React.Dispatch<React.SetStateAction<string>>;
}

const styles = StyleSheet.create({
  searchbarAndAutofill: {
    gap: 5,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchBarInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 5,
    borderRadius: 35,
    backgroundColor: '#3274a6',
    textAlign: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  textFieldContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  textField: {
    fontSize: 20,
    color: 'white',
  },

  searchButton: {
    padding: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    transform: [{scaleX: -1}],
  },
});
