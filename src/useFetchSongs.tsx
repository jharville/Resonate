import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

export const useFetchSongs = (folderId: string | null) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!folderId || !user) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .doc(folderId)
      .collection('songs')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        if (snapshot.empty) {
          console.log('No songs found in Firestore');
          setSongs([]);
          return;
        }

        const songList = await Promise.all(
          snapshot.docs.map(async doc => {
            const songData = doc.data();

            try {
              const storageRef = storage().ref(songData.storagePath);
              const url = await storageRef.getDownloadURL();

              return {
                id: doc.id,
                name: songData.name,
                url,
              };
            } catch (error) {
              console.error(`Error fetching song URL for ${songData.name}`, error);
              return null;
            }
          }),
        );

        setSongs(songList.filter(song => song !== null));
      });

    return () => unsubscribe();
  }, [folderId, user]);

  return songs;
};

interface Song {
  id: string;
  name: string;
  url: string;
}
