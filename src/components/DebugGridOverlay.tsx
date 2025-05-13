import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';

export const DebugGridOverlay = () => {
  const columns = 12;
  const {width} = useWindowDimensions();
  const columnWidth = width / columns;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.container}>
        {Array.from({length: columns}).map((_, index) => (
          <View
            key={index}
            style={{
              width: columnWidth,
              borderLeftWidth: index === 0 ? 0 : 1,
              borderRightWidth: 0,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
});
