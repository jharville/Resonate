import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {setHasReorderedSongs} from '../redux/reorderSongsModalSlice.ts';
import {useDispatch} from 'react-redux';

export const CustomAlert = ({triggerAlert, message}: CustomAlertProps) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (triggerAlert) {
      setVisible(true);

      const timeout = setTimeout(() => {
        setVisible(false);
        dispatch(setHasReorderedSongs(false)); // resets the alert
      }, 2000); // 2 seconds

      return () => clearTimeout(timeout);
    }
  }, [triggerAlert]);

  if (!visible) return null;

  return (
    <Modal visible={triggerAlert} transparent animationType="fade">
      <View style={styles.bottomContainer}>
        <View style={styles.box}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#0078D7',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

type CustomAlertProps = {
  triggerAlert: boolean;
  message: string;
};
