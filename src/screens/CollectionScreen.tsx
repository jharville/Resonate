import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, ActivityIndicator, Text} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types';
import {Folder} from '../components/Folder';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {UploadFolderModal} from '../components/modals/UploadFolderModal.tsx';
import {loadingStatuses, useLoadingStatus} from '../useLoadingStatuses';
import {collection, onSnapshot, query, orderBy} from '@react-native-firebase/firestore';
import {db} from '../../firebaseConfig';
import {toggleParentFolderOptionsModal} from '../redux/parentFolderOptionsModalSlice.ts';
import {
  setParentFolderID,
  setArtistName,
  setParentFolderName,
} from '../redux/renameParentFolderSlice.ts';

// This is the "Collection Screen". All unique Folders will be listed in this stack.

export const CollectionScreen = ({navigation}: CollectionStackScreenProps<'CollectionScreen'>) => {
  const {status} = useLoadingStatus();
  const [parentFolders, setParentFolders] = useState<
    {
      artistName: string;
      id: string;
      name: string;
      imageURL: string | null;
    }[]
  >([]);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleFolderPress = (folder: {id: string; name: string; artistName: string}) => {
    navigation.navigate('SubFolderScreen', {
      folderId: folder.id,
      name: folder.name,
      artistName: folder.artistName,
    });
  };

  const handleThreeDotPress = (folder: {id: string; name: string; artistName: string}) => {
    dispatch(setParentFolderID(folder.id));
    dispatch(setParentFolderName(folder.name));
    dispatch(setArtistName(folder.artistName));
    dispatch(toggleParentFolderOptionsModal());
  };

  useEffect(() => {
    if (!user) return;
    const foldersRef = collection(db, 'users', user.uid, 'folders');
    const q = query(foldersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const folderList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Untitled',
        artistName: doc.data().artistName || 'untitled',
        imageURL: doc.data().imageURL || null,
      }));

      setParentFolders(folderList);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.wholePage}>
      {status === loadingStatuses.LOADING ? (
        <ActivityIndicator size="large" color="#0078D7" />
      ) : parentFolders.length === 0 ? (
        <View style={styles.noFoldersContainer}>
          <Text style={styles.addAFolderText}>Add a folder!</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {parentFolders.map(folder => (
            <View key={folder.id} style={styles.folderContainer}>
              <Folder
                folderName={folder.name}
                artistName={folder.artistName}
                imageURL={folder.imageURL}
                onPress={() => handleFolderPress(folder)}
                onThreeDotPress={() => handleThreeDotPress(folder)}
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
    paddingBottom: 90,
  },
});
