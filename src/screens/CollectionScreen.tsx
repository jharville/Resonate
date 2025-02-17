import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, ActivityIndicator, Text} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types';
import {Folder} from '../components/Folder';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {UploadFolderModal} from '../components/UploadFolderModal';
import {loadingStatuses, useLoadingStatus} from '../useLoadingStatuses';

// This is the "Collection Screen". All unique Folders will be listed in this stack.

export const CollectionScreen = ({navigation}: CollectionStackScreenProps<'CollectionScreen'>) => {
  const {status, startLoading, setDoneLoading} = useLoadingStatus();
  const [folders, setFolders] = useState<
    {
      artistName: string;
      id: string;
      name: string;
    }[]
  >([]);

  const user = useSelector((state: RootState) => state.auth.user);

  const handleFolderClick = (folder: {id: string; name: string; artistName: string}) => {
    navigation.navigate('PlayerScreen', {
      folderId: folder.id,
      name: folder.name,
      artistName: folder.artistName,
    });
  };
  // Real-time listener for folder changes
  useEffect(() => {
    if (!user) return;
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const folderList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Untitled',
          artistName: doc.data().artistName || 'untitled',
        }));

        setFolders(folderList);
      });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.wholePage}>
      {status === loadingStatuses.LOADING ? (
        <ActivityIndicator size="large" color="#0078D7" />
      ) : folders.length === 0 ? (
        <View style={styles.noFoldersContainer}>
          <Text style={styles.addAFolderText}>Add a folder!</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {folders.map(folder => (
            <View key={folder.id} style={styles.folderContainer}>
              <Folder
                folderName={folder.name}
                artistName={folder.artistName}
                onPress={() => handleFolderClick(folder)}
              />
            </View>
          ))}
        </ScrollView>
      )}

      <UploadFolderModal />
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  noFoldersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addAFolderText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  folderContainer: {
    paddingVertical: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
