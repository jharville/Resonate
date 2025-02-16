import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

export const SongUploadProgress = () => {
  const progress = useSelector((state: RootState) => state.upload.progress);

  if (progress === null) return null;

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, {width: `${progress}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
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
