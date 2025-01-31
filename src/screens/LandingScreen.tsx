import React, {useCallback, useState} from 'react';
import {StyleSheet, View, Text, Keyboard, Pressable} from 'react-native';
import Video from 'react-native-video';
import {LandingStackScreenProps} from '../navigation/types/navigation.types';
import {SearchCity} from '../components/SearchCity';

export const LandingScreen = ({navigation}: LandingStackScreenProps<'LandingScreen'>) => {
  const [userTextInput, setUserTextInput] = useState('');

  const handleSearch = useCallback(() => {
    navigation.navigate('MainStack', {
      screen: 'ResultScreen',
      params: {
        searchTerm: userTextInput.trim(),
      },
    });
  }, [userTextInput, navigation]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      return navigation.navigate('MainStack', {
        screen: 'ResultScreen',
        params: {
          searchTerm: suggestion,
        },
      });
    },
    [navigation],
  );

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.wholeScreen}>
      <Video
        source={require('../assets/Weather_App_Background_Video_Compressed.mp4')}
        style={styles.videoLanding}
        resizeMode="cover"
        repeat
        muted
        playInBackground={false}
      />

      <View style={styles.appTitleAndSearch}>
        <View>
          <Text style={styles.appTitle}>Weather</Text>
          <Text style={styles.appTitle}>App</Text>
        </View>

        <SearchCity
          handleSearch={handleSearch}
          handleSuggestionClick={handleSuggestionClick}
          userTextInput={userTextInput}
          setUserTextInput={setUserTextInput}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 40,
  },
  videoLanding: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -99,
  },

  appTitleAndSearch: {
    gap: 15,
  },

  appTitle: {
    flexDirection: 'column',
    fontSize: 65,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 65,
    textShadowColor: '#184445',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  },
  textOutline: {
    fontSize: 65,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    position: 'absolute',
    left: 1,
    top: 1,
  },
  errorMessage: {
    color: 'red',
  },
});
