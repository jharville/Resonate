import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

// This is the Folder component.
// It is used in both the CollectionScreen and SubFolderScreen.
// It displays an Artist Name ( displayed only in the Parent Folder) or
// a folder Name (displayed only in the SubFolders).

export const Folder = ({
  folderName,
  artistName,
  onPress,
  onThreeDotPress,
  imageURL,
}: FolderProps) => {
  return (
    <View style={styles.wholeBox}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.folderTopBox}>
          {imageURL ? (
            <ImageBackground
              source={{uri: imageURL}}
              style={styles.image}
              resizeMode="cover"
              imageStyle={styles.image}>
              <View />
            </ImageBackground>
          ) : (
            <FontAwesome name="record-vinyl" size={80} color="#0078D7" />
          )}
        </View>
      </TouchableOpacity>
      {/* Conditionally renders the PARENT folder Name text OR the SUBFOLDER Name text */}
      <View style={styles.folderBottomBox}>
        <View style={styles.textBottomBox}>
          {artistName ? (
            <Text style={styles.folderArtistName}>{artistName}</Text>
          ) : (
            <Text style={styles.folderTitle}>{folderName}</Text>
          )}
        </View>
        <TouchableOpacity hitSlop={10} onPress={onThreeDotPress}>
          <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeBox: {
    paddingHorizontal: 20,
  },

  folderTopBox: {
    backgroundColor: '#2C2F33',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 170,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    overflow: 'hidden',
  },

  folderBottomBox: {
    flexDirection: 'row',
    backgroundColor: '#242122',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    overflow: 'hidden',
  },

  settingsButtonStyle: {
    color: 'white',
    fontSize: 25,
  },

  textBottomBox: {},

  folderArtistName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },

  folderTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});

export type FolderProps = {
  folderName?: string;
  artistName?: string;
  imageURL?: string | null;
  onPress?: () => void;
  onThreeDotPress?: () => void;
};
