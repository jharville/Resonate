import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types';
import {Folder} from '../components/Folder';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {UploadFolderModal} from '../components/UploadFolderModal';

// This is the "Collection Screen". All unique Folders will be listed in this stack.

export const CollectionScreen = ({navigation}: CollectionStackScreenProps<'CollectionScreen'>) => {
  const [folders, setFolders] = useState<{id: string; name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);

  const handleFolderClick = (folderId: string) => {
    navigation.navigate('PlayerScreen', {folderId});
  };

  // Creates a New Folder in Firestore
  const handleCreateFolder = async () => {
    if (!user) {
      console.log('user not registered');
      return;
    }

    try {
      const newFolder = {
        name: `Folder ${folders.length + 1}`,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('users').doc(user.uid).collection('folders').add(newFolder);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Real-time listener for folder changes
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const folderList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Untitled',
        }));

        setFolders(folderList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.wholePage}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateFolder}>
        <Text style={styles.buttonText}>+ Create Folder</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#0078D7" />
        ) : (
          folders.map(folder => (
            <View key={folder.id} style={styles.folderContainer}>
              <Folder
                folderName={folder.name}
                artistName={user?.email || 'Unknown Artist'}
                onPress={() => handleFolderClick(folder.id)}
              />
            </View>
          ))
        )}
      </ScrollView>
      <UploadFolderModal />
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
    padding: 20,
  },
  createButton: {
    backgroundColor: '#0078D7',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  folderContainer: {
    paddingVertical: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
