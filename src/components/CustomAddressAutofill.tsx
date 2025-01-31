import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

// Global variable to store timeout ID for the debounce function
let timer: NodeJS.Timeout;

// Debounce function: delays the execution of a function by a specified time (delay)
const debounce = (callbackFunction: (searchedCity: string) => void, delay: number) => {
  return (searchedCity: string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callbackFunction(searchedCity);
    }, delay);
  };
};

const ItemSeparatorComponent = () => <View style={styles.suggestionDivider} />;
const keyExtractor = (item: Suggestion) => item.place_id;

export const CustomAddressAutofill: React.FC<CustomAddressAutofillProps> = ({
  onAcceptedSuggestion,
  onNotSuggestionSubmit,
  searchedCity,
  children,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchedCity.trim()) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${searchedCity}&format=json&limit=5`,
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error Fetching Suggestions:', error);
          setSuggestions([]); // hides suggestions on error
        }
      } else {
        setSuggestions([]);
      }
    };

    // waits 500 ms before suggestions are fetched
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

    // invokes the debounced function
    debouncedFetchSuggestions(searchedCity);

    // cleans up the debounce
    return () => clearTimeout(timer);
  }, [searchedCity]);

  useEffect(() => {
    if (onNotSuggestionSubmit) {
      setSuggestions([]);
    }
  }, [onNotSuggestionSubmit]);

  const renderItem = useCallback(
    ({item}: IRenderItemProps) => {
      const isDisabled = !onAcceptedSuggestion;
      const handleSelectItem = () => onAcceptedSuggestion?.(item.display_name);

      return (
        <TouchableOpacity disabled={isDisabled} onPress={handleSelectItem}>
          <Text style={styles.suggestionText}>{item.display_name}</Text>
        </TouchableOpacity>
      );
    },
    [onAcceptedSuggestion],
  );

  return (
    <>
      {children}
      {suggestions.length > 0 && (
        <View style={styles.resultContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    position: 'absolute',
    top: 65,
    borderWidth: 4,
    borderColor: '#00f0f8',
    borderRadius: 8,
    backgroundColor: '#333',
    paddingHorizontal: 10,
    color: 'white',
    fontFamily: 'Roboto',
    zIndex: 99,
  },

  resultListItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#00f0f884',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },

  suggestionText: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 8,
  },

  suggestionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#00f0f884',
  },

  lastResultListItem: {
    borderBottomWidth: 0,
  },
});

interface Suggestion {
  place_id: string;
  display_name: string;
}

interface CustomAddressAutofillProps {
  onAcceptedSuggestion?: (suggestion: string) => void;
  onNotSuggestionSubmit?: () => void;
  searchedCity: string;
  children?: React.ReactNode;
}
interface IRenderItemProps {
  item: Suggestion;
  index: number;
}
