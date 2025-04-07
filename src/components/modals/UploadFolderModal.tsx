import React, {useState, useRef} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Text,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {auth, db} from '../../../firebaseConfig';
import {collection, doc, serverTimestamp, setDoc} from '@react-native-firebase/firestore';
import {ToggleButton} from '../ToggleButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store.tsx';
import {setArtistName, setParentFolderName} from '../../redux/renameParentFolderSlice.ts';

export const UploadFolderModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const folderName = useSelector((state: RootState) => state.renameParentFolder.folderName);
  const artistName = useSelector((state: RootState) => state.renameParentFolder.artistName);

  const screenWidth = Dimensions.get('window').width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  const openModal = () => {
    dispatch(setParentFolderName(''));
    dispatch(setArtistName(''));
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Moves left
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 500,
      easing: Easing.in(Easing.exp),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleCreateFolder = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('User is not registered');
      return;
    }

    if (!artistName.trim()) {
      Alert.alert('Error', 'Please enter an Artist Name.');
      return;
    }

    try {
      const newFolder = {
        name: folderName.trim(),
        artistName: artistName.trim(),
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(collection(db, 'users', user.uid, 'folders')), newFolder);
      dispatch(setParentFolderName(''));
      dispatch(setArtistName(''));
      closeModal();
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('Error', 'Failed to create folder.');
    }
  };

  return (
    <View style={styles.wholeContainer}>
      {/* Create Folder Button */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={openModal}>
          <Entypo name="plus" size={40} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent>
        <Animated.View style={[styles.modalContainer, {transform: [{translateX: slideAnim}]}]}>
          <View style={styles.modalContent}>
            {/*  */}
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitleText}>Create A New Folder!</Text>
            </View>

            <View style={styles.inputFieldsAndButtons}>
              <View style={styles.inputFieldsContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Artist Name (e.g. Metallica)"
                  placeholderTextColor="#FFFFFF"
                  value={artistName}
                  onChangeText={text => dispatch(setArtistName(text))}
                />
              </View>

              <View style={styles.permissionsConatiner}>
                <Text style={styles.permissionsText}>Permissions</Text>
                {/*  */}
                <View style={styles.permissionTextAndIcon}>
                  <Feather name="info" size={30} color="white" />
                  <Text style={styles.permissionsWarningText}>
                    The permissions you set here apply to all folder's guests. The download selector
                    applies to guests as well as the private link visitors
                  </Text>
                </View>

                <View style={styles.permissionsParamsContainer}>
                  <View style={styles.permissionIconSelectorRow}>
                    <Text style={styles.permissionParamsText}>Add Files</Text>

                    <ToggleButton
                      buttonOptions={['On', 'Off']}
                      onSelectOption={() => {
                        null;
                      }}
                    />
                  </View>

                  <View style={styles.permissionIconSelectorRow}>
                    <Text style={styles.permissionParamsText}>Download</Text>
                    <ToggleButton
                      buttonOptions={['On', 'Off']}
                      onSelectOption={() => {
                        null;
                      }}
                    />
                  </View>

                  <View style={styles.permissionIconSelectorRow}>
                    <Text style={styles.permissionParamsText}>Comment</Text>
                    <ToggleButton
                      buttonOptions={['On', 'Off']}
                      onSelectOption={() => {
                        null;
                      }}
                    />
                  </View>

                  <View style={styles.permissionIconSelectorRow}>
                    <Text style={styles.permissionParamsText}>Share</Text>
                    <ToggleButton
                      buttonOptions={['On', 'Off']}
                      onSelectOption={() => {
                        null;
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createButton} onPress={handleCreateFolder}>
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {},

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 10,
    zIndex: 10,
  },

  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    backgroundColor: '#151314',
  },

  modalContent: {
    gap: 10,
    flexDirection: 'column',
  },

  inputFieldsAndButtons: {
    paddingTop: 50,
    gap: 10,
  },
  inputFieldsContainer: {
    paddingBottom: 20,
  },

  modalTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalTitleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  input: {
    paddingHorizontal: 10,
    color: '#feffff',
    borderBottomWidth: 1,
    borderColor: '#57595d',
    fontSize: 20,
    fontWeight: '600',
  },

  permissionsContainer: {
    color: 'white',
  },
  permissionsConatiner: {
    gap: 10,
    paddingHorizontal: 10,
  },
  permissionsText: {
    color: 'white',
    fontWeight: 700,
  },

  permissionsParamsContainer: {paddingHorizontal: 10, gap: 5},

  permissionTextAndIcon: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  permissionsWarningText: {
    color: 'white',
    fontSize: 12,

    flexShrink: 1,
  },

  permissionParamsText: {
    color: 'white',
  },
  permissionIconSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  buttonsContainer: {
    paddingTop: 40,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: 'gray',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#0078D7',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
