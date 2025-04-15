import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity, Animated, StyleSheet, Dimensions, View, Share} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {auth} from '../../../firebaseConfig.tsx';
import {closePlayerScreenMainOptionsModal} from '../../redux/playerScreenMainOptionsModalSlice.ts';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// This is the PlayerScreen Main Options Modal.
// It allows the user to Reorder the playlist and download the whole list.
// It allows the user to share the subFolder the songs are in
// (NOT to be confused with sharing the subfolder in the SubFolderScreen but it is the same functonality)

export const PlayerScreenMainOptionsModal = ({
  route,
  onReorderPress,
}: PlayerScreenMainOptionsModalProps) => {
  const {folderId, artistName, subFolderName} = route;
  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.playerScreenMainOptionsModal.isPlayerScreenMainOptionsModalVisible,
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

  const handleShareButtonPress = async () => {
    try {
      const url = `https://Resonate.com/player?folderId=${folderId}&artistName=${encodeURIComponent(
        artistName,
      )}&subFolderName=${encodeURIComponent(subFolderName)}`;
      await Share.share({
        message: `Listen to "${subFolderName}" by ${artistName}
        \n${url}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReorderPress = () => {
    onReorderPress();
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => dispatch(closePlayerScreenMainOptionsModal())}
          style={styles.backdrop}
        />
      )}

      <Animated.View style={[styles.menu, {transform: [{translateY: slideAnim}]}]}>
        <View style={styles.itemsContainer}>
          {/* Share */}
          <TouchableOpacity style={styles.pressableRow} onPress={handleShareButtonPress}>
            <FontAwesome6 name="share-from-square" size={28} color={'white'} />
            <Text style={styles.pressableText}>Share</Text>
          </TouchableOpacity>

          {/* Reorder List */}
          <TouchableOpacity onPress={handleReorderPress} style={styles.pressableRow}>
            <FontAwesome name="reorder" size={30} color="white" />
            <Text style={styles.pressableText}>Reorder</Text>
          </TouchableOpacity>

          {/* Download */}
          <TouchableOpacity style={styles.pressableRow}>
            <FontAwesome name="download" size={30} color="white" />
            <Text style={styles.pressableText}>Download (Not Yet Available)</Text>
          </TouchableOpacity>
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
    height: '28%',
    backgroundColor: '#2e3133',
    paddingHorizontal: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  itemsContainer: {
    gap: 25,
  },

  pressableRow: {
    flexDirection: 'row',
    gap: 15,
  },
  pressableText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 500,
  },
});

type PlayerScreenMainOptionsModalProps = {
  route: {
    folderId: string;
    artistName: string;
    subFolderName: string;
  };
  onReorderPress: () => void;
};
