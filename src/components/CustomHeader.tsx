import {StyleSheet, View} from 'react-native';
import {LeftSideHeader} from '../navigation/HeaderComponents/LeftSideHeader.tsx';
import {RightSideHeader} from '../navigation/HeaderComponents/RightSideHeader.tsx';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

export const CustomHeader = ({route, navigation}: CustomHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <LeftSideHeader />
      <RightSideHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    backgroundColor: '#151314',
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#4e555d',
  },
});

interface CustomHeaderProps extends NativeStackHeaderProps {}
