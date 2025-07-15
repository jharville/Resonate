import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types.ts';
import {Folder} from '../components/Folder.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store.tsx';
import {loadingStatuses, useLoadingStatus} from '../Hooks/useLoadingStatuses.ts';
import {collection, onSnapshot, query, orderBy} from '@react-native-firebase/firestore';
import {db} from '../../firebaseConfig.ts';
import {togglesubFolderOptionsModal} from '../redux/subFolderOptionsModalSlice.ts';
import {setSubFolderID, setSubFolderName} from '../redux/renameSubFolderSlice.ts';
import {UploadSubFolderModal} from '../components/modals/UploadSubFolderModal.tsx';
import Entypo from 'react-native-vector-icons/Entypo';
import {setParentFolderID} from '../redux/renameParentFolderSlice.ts';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {SongUploadProgress} from '../components/SongUploadProgress.tsx';

// This is the "SubFolder" Screen. All Subfolders stored within a Parent Folder from "Collection Screen" will be listed in this stack.

export const SubFolderScreen = ({
  route,
  navigation,
}: CollectionStackScreenProps<'SubFolderScreen'>) => {
  const {status, startLoading, setDoneLoading} = useLoadingStatus();
  const [subFolders, setSubFolders] = useState<
    {
      parentFolderName: string;
      subFolderId: string;
      subFolderName: string;
      imageURL: string | null;
    }[]
  >([]);
  const {parentFolderId, parentFolderName} = route.params;
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubFolderPress = (subFolder: {
    subFolderId: string;
    subFolderName: string;
    parentFolderName: string;
  }) => {
    navigation.navigate('PlayerScreen', {
      parentFolderId,
      parentFolderName: subFolder.parentFolderName,
      subFolderId: subFolder.subFolderId,
      subFolderName: subFolder.subFolderName,
    });
  };

  const handleThreeDotPress = (subFolder: {subFolderId: string; subFolderName: string}) => {
    dispatch(setParentFolderID(parentFolderId));
    dispatch(setSubFolderID(subFolder.subFolderId));
    dispatch(setSubFolderName(subFolder.subFolderName));
    dispatch(togglesubFolderOptionsModal());
  };

  //for dynamically displaying subfolders
  useEffect(() => {
    if (!user) return;
    startLoading();
    const subFoldersRef = collection(
      db,
      'users',
      `${user.displayName}: ${user.uid}`,
      'parentfolders',
      parentFolderId,
      'subfolders',
    );
    const q = query(subFoldersRef, orderBy('createdAt', 'desc'));

    //In Firebase, a snapshot represents a real-time “snapshot” of data at a specific location Firestore database.
    //When used in a listener like onSnapshot, it's what gives you live updates.
    //If you don’t call cleanupFunction(), the listener keeps running — even when the component unmounts
    const cleanupFunction = onSnapshot(q, snapshot => {
      const subFolderList = snapshot.docs.map(doc => ({
        subFolderId: doc.id,
        parentFolderName: doc.data().storedInParentFolder || 'Untitled',
        subFolderName: doc.data().subFolderName || 'Untitled',
        imageURL: doc.data().imageURL || null,
      }));

      setSubFolders(subFolderList);
    });

    setDoneLoading();
    return () => cleanupFunction();
  }, [user, parentFolderId]);

  const handleSubMainOptionsPress = () => {
    console.log('Subfolder main menu pressed');
  };

  return (
    <View style={styles.wholePage}>
      <SongUploadProgress />
      <View style={styles.parentFolderNameContainer}>
        {status === loadingStatuses.LOADING ? (
          <SkeletonPlaceholder
            borderRadius={4}
            backgroundColor="rgba(123, 123, 125, 0.5)"
            highlightColor="rgba(255, 255, 255, 1)">
            <View>
              <SkeletonPlaceholder.Item
                style={{
                  marginLeft: 10,
                }}
                width={100}
                height={26}
              />
            </View>
          </SkeletonPlaceholder>
        ) : (
          <>
            <Text style={styles.parentNameStyle}>{parentFolderName}</Text>
            <TouchableOpacity onPress={handleSubMainOptionsPress}>
              <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {status === loadingStatuses.LOADING ? (
        <SkeletonPlaceholder
          borderRadius={4}
          backgroundColor="rgba(123, 123, 125, 0.5)"
          highlightColor="rgba(255, 255, 255, 1)">
          <View style={{paddingHorizontal: 40, paddingTop: 20, alignItems: 'center'}}>
            <SkeletonPlaceholder.Item width={'100%'} height={225} borderRadius={6} />
          </View>
        </SkeletonPlaceholder>
      ) : subFolders.length === 0 ? (
        <View style={styles.noFoldersContainer}>
          <Text style={styles.addAFolderText}>Now add a Subfolder!</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {subFolders.map(subFolder => (
            <View key={subFolder.subFolderId} style={styles.folderContainer}>
              <Folder
                subFolderName={subFolder.subFolderName}
                imageURL={subFolder.imageURL}
                onPress={() => handleSubFolderPress(subFolder)}
                onThreeDotPress={() =>
                  handleThreeDotPress({
                    subFolderId: subFolder.subFolderId,
                    subFolderName: subFolder.subFolderName,
                  })
                }
              />
            </View>
          ))}
        </ScrollView>
      )}

      <UploadSubFolderModal parentFolderId={parentFolderId} parentFolderName={parentFolderName} />
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
  },

  parentFolderNameContainer: {
    backgroundColor: '#2C2F33',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },

  parentNameStyle: {
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
