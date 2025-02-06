import {StyleSheet, Text, View} from 'react-native';
import {HeaderBarsButton} from './HeaderBarsButton';
import {HeaderBackButton} from './HeaderBackButton';

export const LeftSideHeader = () => {
  return (
    <View style={styles.wholeContainer}>
      <View style={styles.backAndBarsButton}>
        <HeaderBackButton />
        <HeaderBarsButton canGoBack={false} />
      </View>

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

  titleText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 500,
    fontFamily: 'Orbitron',
    alignItems: 'center',
  },

  backAndBarsButton: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  headerBackButton: {},
});
