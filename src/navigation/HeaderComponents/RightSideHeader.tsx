import {StyleSheet, View} from 'react-native';
import {HeaderSearchButton} from './HeaderSearchButton';
import {HeaderNotificationButton} from './HeaderNotifcationButton';
import {HeaderAccountButton} from './HeaderAccountButton';
import {isIOS} from '../../utilities/constants.ts';

export const RightSideHeader = () => {
  return (
    <View style={styles.wholeContainer}>
      <HeaderSearchButton canGoBack={false} />
      <HeaderNotificationButton canGoBack={false} />
      <HeaderAccountButton canGoBack={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isIOS ? 20 : 15,
    alignItems: 'center',
  },
  settingsButtonStyle: {color: 'white', fontSize: 38},
});
