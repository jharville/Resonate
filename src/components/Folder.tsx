import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

// This is the Folder component.
// It is used in both the CollectionScreen and SubFolderScreen.
// It displays a Parent Folder Name or a SubFolder Name.

export const Folder = ({
  parentFolderName,
  subFolderName,
  onPress,
  onThreeDotPress,
  imageURL,
}: FolderProps) => {
  return (
    <View style={styles.wholeContainer}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.imageOrIconContainer}>
          {imageURL ? (
            <View style={styles.uploadedImageContainer}>
              <Image source={{uri: imageURL}} style={styles.uploadedImage} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.defaultRecordIcon}>
              <FontAwesome name="record-vinyl" size={120} color="#0078D7" />
            </View>
          )}

          {/* Conditionally renders the PARENT folder Name text OR the SUBFOLDER Name text */}
          <View style={styles.bottomTab}>
            <View>
              {parentFolderName ? (
                <Text style={styles.parentFolderName}>{parentFolderName}</Text>
              ) : (
                <Text style={styles.subFolderName}>{subFolderName}</Text>
              )}
            </View>
            <TouchableOpacity hitSlop={10} onPress={onThreeDotPress}>
              <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    paddingHorizontal: 20,
  },

  imageOrIconContainer: {
    backgroundColor: '#2C2F33',
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },

  bottomTab: {
    flexDirection: 'row',
    backgroundColor: '#212124d3',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  settingsButtonStyle: {
    color: 'white',
    fontSize: 25,
  },

  parentFolderName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },

  subFolderName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },

  defaultRecordIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    paddingBottom: 40,
  },

  uploadedImageContainer: {
    aspectRatio: 1,
  },

  uploadedImage: {
    flex: 1,
  },
});

export type FolderProps = {
  parentFolderName?: string;
  subFolderName?: string;
  imageURL?: string | null;
  onPress?: () => void;
  onThreeDotPress?: () => void;
};
