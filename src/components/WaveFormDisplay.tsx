import {View, useWindowDimensions, StyleSheet} from 'react-native';
import {audioBarsAmount, stickWidth, WaveForms} from './WaveForms.tsx';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useProgress} from 'react-native-track-player';
import {useMemo} from 'react';

const audioBars = audioBarsAmount;

export const WaveFormDisplay = ({waveformData}: WaveFormAppProps) => {
  const songProgress = useProgress(5);
  const {width} = useWindowDimensions(); //Dynamic Screen Width

  const waveformTranslateStyle = useAnimatedStyle(() => {
    'worklet';
    const ratio = songProgress.duration > 0 ? songProgress.position / songProgress.duration : 0;
    const offset = -(stickWidth * audioBars * ratio - width / 2);
    // Translates the waveform to keep progress aligned vertically
    return {
      transform: [{translateX: offset}],
    };
  }, [songProgress.duration, songProgress.position, width]);

  const BlueWaves = useMemo(
    () => (
      <>
        <View>
          <WaveForms waveformData={waveformData} waveColor={'#0078D7'} />
        </View>
        <View>
          <WaveForms waveformData={waveformData} waveColor={'#0078D7'} upsideDown />
        </View>
      </>
    ),
    [waveformData],
  );

  const GreyWaves = useMemo(
    () => (
      <>
        <View>
          <WaveForms waveformData={waveformData} waveColor={'#5e6367'} />
        </View>
        <View>
          <WaveForms waveformData={waveformData} waveColor={'#5e6367'} upsideDown />
        </View>
      </>
    ),
    [waveformData],
  );

  return (
    <>
      {/* Centered waveform container */}
      <View style={styles.wavesContainer}>
        {/* The margin stuff is to have the wave start right on the white line */}
        <Animated.View style={[{marginLeft: -20}, waveformTranslateStyle]}>
          {GreyWaves}
        </Animated.View>
        <View style={styles.centerLine} />
        <View style={styles.blueWave}>
          <Animated.View style={[{marginLeft: -20}, waveformTranslateStyle]}>
            {BlueWaves}
          </Animated.View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  blueWave: {
    position: 'absolute',
    width: '50%',
    overflow: 'hidden',
  },

  wavesContainer: {
    position: 'relative',
    left: 0,
    width: '100%',
    overflow: 'hidden',
  },

  centerLine: {
    position: 'absolute',
    alignSelf: 'center',
    height: '100%',
    width: 3,
    backgroundColor: 'white',
    zIndex: 10,
  },
});

type WaveFormAppProps = {
  waveformData: number[] | undefined;
};
