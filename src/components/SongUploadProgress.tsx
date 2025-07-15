import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import LoadingDots from 'react-native-loading-dots';

export const SongUploadProgress = () => {
  const progress = useSelector((state: RootState) => state.upload.progress);

  if (progress === null) return null;

  return (
    <>
      <View style={styles.wholeContainer}>
        <View style={styles.textAndDots}>
          <Text style={styles.uploadingText}>Uploading</Text>
          <View style={styles.dotsWrapper}>
            <LoadingDots
              dots={3}
              size={5}
              colors={['#ffffff', '#ffffff', '#ffffff']}
              bounceHeight={4}
            />
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {gap: 5, paddingTop: 5},
  textAndDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },

  dotsWrapper: {
    justifyContent: 'flex-end',
    paddingBottom: 5,
    width: 25,
  },

  uploadingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600,
  },

  progressContainer: {
    height: 8, // ✅ Thickness of the bar
    width: '100%', // ✅ Full width
    backgroundColor: '#555', // ✅ Background color (gray)
    borderRadius: 5, // ✅ Rounded edges
    overflow: 'hidden', // ✅ Ensures inner bar doesn't overflow
  },

  progressBar: {
    height: '100%', // ✅ Fill the container height
    backgroundColor: '#0078D7', // ✅ Blue progress indicator
  },
});
