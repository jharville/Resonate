import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getFirestore,
} from '@react-native-firebase/firestore';
import {getDownloadURL, getStorage, ref} from '@react-native-firebase/storage';

export const useFetchSongs = (folderId: string | null) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!folderId || !user) return;

    const songsRef = collection(getFirestore(), 'users', user.uid, 'folders', folderId, 'songs');
    const q = query(songsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async snapshot => {
      if (snapshot.empty) {
        console.log('No songs found in Firestore');
        setSongs([]);
        return;
      }

      const songList = await Promise.all(
        snapshot.docs.map(async doc => {
          const songData = doc.data();

          try {
            const url = await getDownloadURL(ref(getStorage(), songData.storagePath));

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

      setSongs(songList.filter(song => song !== null) as Song[]);
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
