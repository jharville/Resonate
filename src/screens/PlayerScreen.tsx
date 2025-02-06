import React, {useCallback, useState} from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types';
import {Folder} from '../components/Folder';
import {FooterSearchIcon} from '../navigation/FooterComponents/FooterSearchIcon';
import {HeaderBackButton} from '../navigation/HeaderComponents/HeaderBackButton';
import Entypo from 'react-native-vector-icons/Entypo';
import TrackPlayer from 'react-native-track-player';
import {AudioPlayer} from '../components/AudioPlayer.tsx';

// This is the "Player Screen" this will only render players.
// Players should only have song list functionality and options.
// No folder funcitonality

export const PlayerScreen = () => {
  //

  return (
    <View style={styles.wholePage}>
      <Text style={styles.playerScreenText}>PlayerScreen</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.folderContainer}>
          <AudioPlayer />
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Entypo name="plus" size={40} color="white" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
  },

  playerScreenText: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'grey',
    fontSize: 20,
  },

  folderContainer: {
    gap: 25,
    paddingBottom: 20,
  },

  scrollContent: {
    paddingTop: 20,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type FooterSearchIconProps = {
  onPressIcon: () => void;
};
