import {useEffect, useState} from 'react';
import storage from '@react-native-firebase/storage';

export const useFetchSongs = (): Song[] => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongsFromStorage = async () => {
      try {
        const storageRef = storage().ref('Songs'); // References the "Songs" folder in Firebase Storage which willl later be dynamic
        const files = await storageRef.listAll(); // List all files in "Songs"

        const songUrls: Song[] = await Promise.all(
          files.items.map(async fileRef => {
            const url = await fileRef.getDownloadURL();
            return {id: fileRef.fullPath, name: fileRef.name, url}; // Returns name & URL
          }),
        );

        setSongs(songUrls);
      } catch (error) {
        console.error('Error fetching songs');
      }
    };

    fetchSongsFromStorage();
  }, []);

  return songs;
};

interface Song {
  id: string;
  name: string;
  url: string;
}
