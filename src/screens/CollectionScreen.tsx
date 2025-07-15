import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, ActivityIndicator, Text} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types';
import {Folder} from '../components/Folder';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {UploadFolderModal} from '../components/modals/UploadFolderModal.tsx';
import {loadingStatuses, useLoadingStatus} from '../Hooks/useLoadingStatuses.ts';
import {collection, onSnapshot, query, orderBy} from '@react-native-firebase/firestore';
import {db} from '../../firebaseConfig';
import {toggleParentFolderOptionsModal} from '../redux/parentFolderOptionsModalSlice.ts';
import {setParentFolderID, setParentFolderName} from '../redux/renameParentFolderSlice.ts';
import {SongUploadProgress} from '../components/SongUploadProgress.tsx';

// This is the "Collection Screen". All unique Folders will be listed in this stack.

export const CollectionScreen = ({navigation}: CollectionStackScreenProps<'CollectionScreen'>) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const {status} = useLoadingStatus();
  const [parentFolders, setParentFolders] = useState<
    {
      parentFolderID: string;
      parentFolderName: string;
      imageURL: string | null;
    }[]
  >([]);

  const handleFolderPress = (folder: {parentFolderId: string; parentFolderName: string}) => {
    navigation.navigate('SubFolderScreen', {
      parentFolderId: folder.parentFolderId,
      parentFolderName: folder.parentFolderName,
    });
  };

  const handleThreeDotPress = (folder: {parentFolderId: string; parentFolderName: string}) => {
    dispatch(setParentFolderID(folder.parentFolderId));
    dispatch(setParentFolderName(folder.parentFolderName));
    dispatch(toggleParentFolderOptionsModal());
  };

  useEffect(() => {
    if (!user) return;
    const foldersRef = collection(db, 'users', `${user.displayName}: ${user.uid}`, 'parentfolders');
    const q = query(foldersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const parentFolderList = snapshot.docs.map(doc => ({
        parentFolderID: doc.id,
        parentFolderName: doc.data().parentFolderName || 'Untitled',
        imageURL: doc.data().imageURL || null,
      }));

      setParentFolders(parentFolderList);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.wholePage}>
      <SongUploadProgress />
      {status === loadingStatuses.LOADING ? (
        <ActivityIndicator size="large" color="#0078D7" />
      ) : parentFolders.length === 0 ? (
        <View style={styles.noFoldersContainer}>
          <Text style={styles.addAFolderText}>Hi!</Text>
          <Text style={styles.addAFolderText}>First, add an "Artist" folder!</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {parentFolders.map(folder => (
            <View key={folder.parentFolderID} style={styles.parentFolderContainer}>
              <Folder
                parentFolderName={folder.parentFolderName}
                subFolderName={folder.parentFolderName}
                imageURL={folder.imageURL}
                onPress={() =>
                  handleFolderPress({
                    parentFolderId: folder.parentFolderID,
                    parentFolderName: folder.parentFolderName,
                  })
                }
                onThreeDotPress={() =>
                  handleThreeDotPress({
                    parentFolderId: folder.parentFolderID,
                    parentFolderName: folder.parentFolderName,
                  })
                }
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
  },

  noFoldersContainer: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addAFolderText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  parentFolderContainer: {
    paddingVertical: 20,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
});
