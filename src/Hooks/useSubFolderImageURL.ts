import {useEffect, useState} from 'react';
import {doc, getDoc, getFirestore} from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../store.tsx';

export const useSubFolderImageURL = ({
  parentFolderId,
  subFolderId,
}: {
  parentFolderId: string;
  subFolderId: string;
}) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchImage = async () => {
      const db = getFirestore();
      const ref = doc(
        db,
        'users',
        `${user?.displayName}: ${user?.uid}`,
        'parentfolders',
        parentFolderId,
        'subfolders',
        subFolderId,
      );

      const docSnap = await getDoc(ref);
      if (docSnap.exists) {
        const url = docSnap.data()?.imageURL || null;
        setImageURL(url);
      }
    };

    fetchImage();
  }, [user, parentFolderId, subFolderId]);

  return imageURL;
};
