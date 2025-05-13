import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store.tsx';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getFirestore,
} from '@react-native-firebase/firestore';
import {getDownloadURL, getMetadata, getStorage, ref} from '@react-native-firebase/storage';
import {setAudioMetaData} from '../redux/playerSlice.tsx';

export const useFetchSongs = ({parentFolderId, subFolderId}: UseFetchSongsProps) => {
  const [songs, setSongs] = useState<Song[] | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const songsRef = collection(
      getFirestore(),
      'users',
      `${user?.displayName}: ${user?.uid}`,
      'parentfolders',
      parentFolderId,
      'subfolders',
      subFolderId,
      'songs',
    );

    const q = query(songsRef, orderBy('order'));

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
            const storageRef = ref(getStorage(), songData.storagePath);
            const metadata = await getMetadata(storageRef);
            const customMetadata = metadata.customMetadata || {};

            // Dispatches Song metadata to Redux for use in AudioPlayerModal
            dispatch(
              setAudioMetaData({
                songName: songData.songName_current,
                metaData: {
                  sampleRate: customMetadata.sampleRate
                    ? Number(customMetadata.sampleRate)
                    : undefined,
                  channelCount: customMetadata.channelCount
                    ? Number(customMetadata.channelCount)
                    : undefined,
                  bitDepth: customMetadata.bitDepth ? Number(customMetadata.bitDepth) : undefined,
                  bitRate: customMetadata.bitRate ? Number(customMetadata.bitRate) : undefined,
                  duration: customMetadata.duration ? Number(customMetadata.duration) : undefined,
                  fileType: customMetadata.fileType || undefined,
                  fileSize: metadata.size ? Number(metadata.size) : undefined,
                  loudnessLufs: customMetadata.loudnessLufs
                    ? Number(customMetadata.loudnessLufs)
                    : undefined,

                  waveform: customMetadata.waveform
                    ? JSON.parse(customMetadata.waveform)
                    : undefined,
                },
              }),
            );

            return {
              id: doc.id,
              name: songData.songName_current,
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
    });
    return () => unsubscribe();
  }, [user, parentFolderId, subFolderId, dispatch]);
  return songs;
};

type UseFetchSongsProps = {
  parentFolderId: string;
  subFolderId: string;
};
interface Song {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  duration?: number;
}
