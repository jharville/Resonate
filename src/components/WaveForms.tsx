import {StyleSheet, View} from 'react-native';
import {isIOS} from '../utilities/constants.ts';

export const audioBarsAmount = 512;
export const stickWidth = 2;

export const WaveForms = ({waveformData, waveColor, upsideDown}: WaveFormsProps) => {
  const getStickStyle = (height: number): object => ({
    //What I'm doing here:
    //This wave won't be centered in its container (because it's position is absolute)
    //so I've done some margin stuff to keep it centered no matter how loud the audio is.

    //height: The height of the bar (based on audio loudness)
    //70: This is the full height of the wave container (top + bottom combined)
    //(70 - height) / 2: This centers the bar by splitting the leftover space between top and bottom
    //upsideDown: If the bar is the bottom half of the wave, we want the margin to push it up instead of down
    height,
    marginTop: upsideDown ? 0 : (70 - height) / 2,
    marginBottom: upsideDown ? (70 - height) / 2 : 0,
    backgroundColor: waveColor,
  });

  return (
    <View style={styles.container}>
      {waveformData?.map((value, index) => {
        const height = Math.min(value * 1.4, 35);
        return <View key={index} style={[styles.stick, getStickStyle(height)]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stick: {
    width: stickWidth,
  },
});

type WaveFormsProps = {
  waveformData: number[] | undefined;
  upsideDown?: boolean;
  waveColor: string;
};
