import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getFirestore,
} from '@react-native-firebase/firestore';
import {getDownloadURL, getStorage, ref} from '@react-native-firebase/storage';
import {setTrackQueue} from './redux/playerSlice.tsx';

export const useFetchSongs = (folderId: string | null) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!folderId || !user) return;

    const songsRef = collection(getFirestore(), 'users', user.uid, 'folders', folderId, 'songs');
    const q = query(songsRef, orderBy('order'));

    const unsubscribe = onSnapshot(q, async snapshot => {
      if (snapshot.empty) {
        console.log('No songs found in Firestore');
        setSongs([]);
        dispatch(setTrackQueue([]));
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
              storagePath: songData.storagePath,
            };
          } catch (error) {
            console.error(`Error fetching song URL for ${songData.name}`, error);
            return null;
          }
        }),
      );

      const validSongs = songList.filter(song => song !== null) as Song[];

      setSongs(validSongs);
      dispatch(setTrackQueue(validSongs.map(({id, url, name}) => ({id, url, name}))));
    });

    return () => unsubscribe();
  }, [folderId, user, dispatch]);

  return songs;
};

interface Song {
  id: string;
  name: string;
  url: string;
  storagePath: string;
}
