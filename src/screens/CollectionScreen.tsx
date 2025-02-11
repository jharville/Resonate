import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types';
import {Folder} from '../components/Folder';

// This is the "Collection Screen". All unique Folders and Players will be listed in this stack.

export const CollectionScreen = ({navigation}: CollectionStackScreenProps<'CollectionScreen'>) => {
  //
  const handleFolderClick = () => {
    navigation.navigate('PlayerScreen');
  };

  return (
    <View style={styles.wholePage}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.folderContainer}>
          <Folder onPress={() => handleFolderClick('Folder 1')} />
        </View>
        {/*  */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
  },

  folderContainer: {
    gap: 25,
    paddingBottom: 20,
  },

  scrollContent: {
    paddingTop: 20,
  },
});
