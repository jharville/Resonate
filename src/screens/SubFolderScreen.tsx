import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types.ts';
import {Folder} from '../components/Folder.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store.tsx';
import {loadingStatuses, useLoadingStatus} from '../useLoadingStatuses.tsx';
import {collection, onSnapshot, query, orderBy} from '@react-native-firebase/firestore';
import {db} from '../../firebaseConfig.tsx';
import {togglesubFolderOptionsModal} from '../redux/subFolderOptionsModalSlice.ts';
import {setSubFolderID, setSubFolderName} from '../redux/renameSubFolderSlice.ts';
import {UploadSubFolderModal} from '../components/modals/UploadSubFolderModal.tsx';
import Entypo from 'react-native-vector-icons/Entypo';
import {setParentFolderID} from '../redux/renameParentFolderSlice.ts';

// // This is the "SubFolder" Screen. All Subfolders stored within a folder from "Collection Screen" will be listed in this stack.

export const SubFolderScreen = ({
  route,
  navigation,
}: CollectionStackScreenProps<'SubFolderScreen'>) => {
  const {status} = useLoadingStatus();
  const [subFolders, setSubFolders] = useState<
    {
      artistName: string;
      id: string;
      name: string;
      imageURL: string | null;
    }[]
  >([]);
  const {folderId, artistName} = route.params;
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleFolderPress = (folder: {id: string; name: string; artistName: string}) => {
    navigation.navigate('PlayerScreen', {
      folderId: folder.id,
      subFolderName: folder.name,
      artistName: folder.artistName,
    });
  };

  const handleThreeDotPress = (folder: {id: string; name: string}) => {
    dispatch(setParentFolderID(folderId));
    dispatch(setSubFolderID(folder.id));
    dispatch(setSubFolderName(folder.name));
    dispatch(togglesubFolderOptionsModal());
  };

  useEffect(() => {
    if (!user) return;

    const foldersRef = collection(db, 'users', user.uid, 'folders', folderId, 'subfolders');
    const q = query(foldersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const subFolderList = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          artistName: doc.data().artistName || 'Untitled',
          name: doc.data().name || 'Untitled',
          imageURL: doc.data().imageURL || null,
        };
      });

      setSubFolders(subFolderList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubMainOptionsPress = () => {
    console.log('Pressed');
  };

  return (
    <View style={styles.wholePage}>
      <View style={styles.artistNameContainer}>
        <Text style={styles.artistNameStyle}>{artistName}</Text>
        <TouchableOpacity onPress={handleSubMainOptionsPress}>
          <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
        </TouchableOpacity>
      </View>
      {status === loadingStatuses.LOADING ? (
        <ActivityIndicator size="large" color="#0078D7" />
      ) : subFolders.length === 0 ? (
        <View style={styles.noFoldersContainer}>
          <Text style={styles.addAFolderText}>Add a Subfolder!</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {subFolders.map(folder => (
            <View key={folder.id} style={styles.folderContainer}>
              <Folder
                folderName={folder.name}
                imageURL={folder.imageURL}
                onPress={() => handleFolderPress(folder)}
                onThreeDotPress={() => handleThreeDotPress(folder)}
              />
            </View>
          ))}
        </ScrollView>
      )}

      <UploadSubFolderModal parentFolderId={folderId} artistName={artistName} />
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
  },

  artistNameContainer: {
    backgroundColor: '#2C2F33',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },

  artistNameStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
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
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingBottom: 90,
  },

  settingsButtonStyle: {
    color: 'white',
    fontSize: 25,
  },
});
