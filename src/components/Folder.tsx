import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

export const Folder = ({onPress}: FolderProps) => {
  return (
    <>
      <View style={styles.wholeBox}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.folderTopBox}>
            <FontAwesome name="record-vinyl" size={80} color="#0078D7" />
          </View>
        </TouchableOpacity>

        <View style={styles.folderBottomBox}>
          <View style={styles.textBottomBox}>
            <Text style={styles.folderTitle}>Demo Stuff</Text>
            <Text style={styles.folderArtistName}>Joey</Text>
          </View>
          <TouchableOpacity hitSlop={10}>
            <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    paddingVertical: 50,
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
    paddingVertical: 10,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    overflow: 'hidden',
  },

  settingsButtonStyle: {
    color: 'white',
    fontSize: 25,
  },

  textBottomBox: {},

  folderTitle: {
    color: 'white',
    fontSize: 15,
  },

  folderArtistName: {
    color: 'white',
    fontSize: 15,
  },
});

export type FolderProps = {
  onPress?: () => void;
};
