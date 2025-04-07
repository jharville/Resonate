import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity, Animated, StyleSheet, Dimensions, View, Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store.tsx';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {auth, db} from '../../../firebaseConfig.tsx';
import {deleteDoc, doc} from '@react-native-firebase/firestore';
import {pickImage} from '../../imagePicker.ts';
import {openRenameParentFolderModal} from '../../redux/renameParentFolderSlice.ts';
import {closeParentFolderOptionsModal} from '../../redux/parentFolderOptionsModalSlice.ts';

export const ParentFolderOptionsModal = () => {
  const [isTrashModalVisible, setTrashModalVisible] = useState(false);

  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.ParentFolderOptionsModal.isParentFolderOptionsModalVisible,
  );

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleRenamePress = () => {
    dispatch(openRenameParentFolderModal());
    dispatch(closeParentFolderOptionsModal());
  };

  const handleTrashPress = () => {
    setTrashModalVisible(true);
  };

  const parentFolderId = useSelector((state: RootState) => state.renameParentFolder.folderID);
  const subFolderId = useSelector((state: RootState) => state.renameSubFolder.subFolderID);

  const handleYesDeletePress = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !parentFolderId) return;
      const folderRef = doc(db, 'users', user.uid, 'folders', parentFolderId);
      await deleteDoc(folderRef);
      setTrashModalVisible(false);
      dispatch(closeParentFolderOptionsModal());
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const handleImagePress = () => {
    dispatch(closeParentFolderOptionsModal());
    pickImage(parentFolderId);
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => dispatch(closeParentFolderOptionsModal())}
          style={styles.backdrop}
        />
      )}
      <Animated.View style={[styles.menu, {transform: [{translateY: slideAnim}]}]}>
        <View style={styles.itemsContainer}>
          {/* Rename */}
          <TouchableOpacity style={styles.menuItem} onPress={handleRenamePress}>
            <View style={styles.renameIconContainerStyle}>
              <MaterialIcons name="drive-file-rename-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.menuText}>Rename</Text>
          </TouchableOpacity>

          {/* ArtWork */}
          <TouchableOpacity style={styles.menuItem} onPress={handleImagePress}>
            <FontAwesome name="picture-o" size={21} color="#fff" />
            <Text style={styles.menuText}>Artwork</Text>
          </TouchableOpacity>

          {/* Move File */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => dispatch(closeParentFolderOptionsModal())}>
            <View style={styles.fileMoveContainerStyle}>
              <MaterialCommunityIcons name="file-move-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.menuText}>Move To (Not Yet Available)</Text>
          </TouchableOpacity>

          {/* Trash */}
          <TouchableOpacity style={styles.menuItem} onPress={handleTrashPress}>
            <FontAwesome5 name="trash-alt" size={24} color="#fff" />
            <Text style={styles.menuText}>Move To Trash</Text>
          </TouchableOpacity>

          {/* Trash Modal */}
          {isTrashModalVisible && (
            <Modal transparent animationType="slide" visible={isTrashModalVisible}>
              <View style={styles.trashModalStyle}>
                <Text style={styles.areYouSureTextStyle}>
                  Are you sure you want to delete this folder? This action cannot be undone.
                </Text>
                {/* Yes Button */}
                <TouchableOpacity
                  onPress={() => {
                    handleYesDeletePress();
                  }}>
                  <Text style={styles.yesButtonTextStyle}>Yes</Text>
                </TouchableOpacity>
                {/* Cancel Button */}
                <TouchableOpacity onPress={() => setTrashModalVisible(false)}>
                  <Text style={styles.cancelButtonTextStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
    backgroundColor: '#2e3133',
    paddingHorizontal: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  itemsContainer: {
    gap: 35,
  },

  menuItem: {flexDirection: 'row', gap: 10, alignItems: 'center'},

  menuText: {color: 'white', fontSize: 18},

  renameIconContainerStyle: {
    marginRight: -3,
  },

  fileMoveContainerStyle: {marginLeft: -4, marginRight: -3},

  closeButtonContainer: {
    paddingHorizontal: 60,
  },

  closeButton: {
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },

  closeText: {color: 'white', fontSize: 18, fontWeight: 500},

  trashModalStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
    backgroundColor: '#2e3133',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    textAlign: 'center',
    gap: 20,
  },

  areYouSureTextStyle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },

  yesButtonTextStyle: {
    backgroundColor: '#0078D7',
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: '500',
    width: 120,
    alignSelf: 'center',
  },

  cancelButtonTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
  },
});
