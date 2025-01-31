import {StyleSheet, Text, View} from 'react-native';
import {HeaderBarsButton} from './HeaderBarsButton';

export const LeftSideHeader = () => {
  return (
    <View style={styles.wholeContainer}>
      <HeaderBarsButton canGoBack={false} />
      <Text style={styles.titleText}>Resonate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'center',
  },

  titleText: {color: 'white', fontSize: 30, fontWeight: 500, fontFamily: 'Orbitron'},
});
