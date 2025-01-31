import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {useCallback, useMemo, useRef, useState} from 'react';
import {format, parseISO} from 'date-fns';
import {getWeatherIcon, getWeatherLabel} from '../utilities/getWeatherStatus';
import React from 'react';
import {ToggleButton} from './ToggleButton.tsx';
import {LineChart} from 'react-native-chart-kit';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {PressableScaleButton} from './PressableScaleButton.tsx';

const buttonOptions = {
  summary: 'Summary',
  hourly: 'Hourly',
};

const chartConfig = {
  backgroundGradientFrom: '#4a638e',
  backgroundGradientTo: '#455e7c',
  fillShadowGradientTo: 'transparent',
  fillShadowGradientToOpacity: 0,
  fillShadowGradientFrom: 'transparent',
  fillShadowGradientFromOpacity: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => '#ffffffff',
  propsForLabels: {
    fontSize: 15,
    fontWeight: '600',
  },
  propsForDots: {
    r: '2',
    strokeWidth: '2',
    stroke: '#ffffff',
  },
};

export const SummaryChart = ({
  weatherCode = [],
  rain = [],
  temps = [],
  forecastDate = [],
  dayClickedIndex,
  setDayClickedIndex,
}: SummaryChartProps) => {
  const [selectedOption, setSelectedOption] = useState(buttonOptions.summary);
  const startHour = dayClickedIndex * 24;
  const endHour = startHour + 24;

  const dayTemps = useMemo(
    () => temps.slice(startHour, endHour).map((temp: number) => Math.round(temp)),
    [temps, startHour, endHour],
  );

  const summaryTempArray = [
    {time: '12 AM', temp: dayTemps?.[0]},
    {time: '2 AM', temp: dayTemps?.[2]},
    {time: '4 AM', temp: dayTemps?.[4]},
    {time: '6 AM', temp: dayTemps?.[6]},
    {time: '8 AM', temp: dayTemps?.[8]},
    {time: '10 AM', temp: dayTemps?.[10]},
    {time: '12 PM', temp: dayTemps?.[12]},
    {time: '2 PM', temp: dayTemps?.[14]},
    {time: '4 PM', temp: dayTemps?.[16]},
    {time: '6 PM', temp: dayTemps?.[18]},
    {time: '8 PM', temp: dayTemps?.[20]},
    {time: '10 PM', temp: dayTemps?.[22]},
  ];

  const hourlyTempArray = [
    {time: '12 AM', temp: dayTemps?.[0]},
    {time: '1 AM', temp: dayTemps?.[1]},
    {time: '2 AM', temp: dayTemps?.[2]},
    {time: '3 AM', temp: dayTemps?.[3]},
    {time: '4 AM', temp: dayTemps?.[4]},
    {time: '5 AM', temp: dayTemps?.[5]},
    {time: '6 AM', temp: dayTemps?.[6]},
    {time: '7 AM', temp: dayTemps?.[7]},
    {time: '8 AM', temp: dayTemps?.[8]},
    {time: '9 AM', temp: dayTemps?.[9]},
    {time: '10 AM', temp: dayTemps?.[10]},
    {time: '11 AM', temp: dayTemps?.[11]},
    {time: '12 PM', temp: dayTemps?.[12]},
    {time: '1 PM', temp: dayTemps?.[13]},
    {time: '2 PM', temp: dayTemps?.[14]},
    {time: '3 PM', temp: dayTemps?.[15]},
    {time: '4 PM', temp: dayTemps?.[16]},
    {time: '5 PM', temp: dayTemps?.[17]},
    {time: '6 PM', temp: dayTemps?.[18]},
    {time: '7 PM', temp: dayTemps?.[19]},
    {time: '8 PM', temp: dayTemps?.[20]},
    {time: '9 PM', temp: dayTemps?.[21]},
    {time: '10 PM', temp: dayTemps?.[22]},
    {time: '11 PM', temp: dayTemps?.[23]},
  ];

  const selectedDate =
    forecastDate && forecastDate[dayClickedIndex]
      ? format(parseISO(forecastDate[dayClickedIndex]), 'EEE, do')
      : '';

  const dateNext = () => {
    if (forecastDate && dayClickedIndex + 1 < forecastDate.length) {
      return format(parseISO(forecastDate[dayClickedIndex + 1]), 'EEE, do');
    }
    return null;
  };

  const rainChance = (rain || []).map((chance: number) => Math.round(chance));
  const filteredRainChance = rainChance.slice(startHour, endHour);

  const summaryRainChanceArray = [
    {time: '12 AM', chance: filteredRainChance?.[0] + '%'},
    {time: '2 AM', chance: filteredRainChance?.[2] + '%'},
    {time: '4 AM', chance: filteredRainChance?.[4] + '%'},
    {time: '6 AM', chance: filteredRainChance?.[6] + '%'},
    {time: '8 AM', chance: filteredRainChance?.[8] + '%'},
    {time: '10 AM', chance: filteredRainChance?.[10] + '%'},
    {time: '12 PM', chance: filteredRainChance?.[12] + '%'},
    {time: '2 PM', chance: filteredRainChance?.[14] + '%'},
    {time: '4 PM', chance: filteredRainChance?.[16] + '%'},
    {time: '6 PM', chance: filteredRainChance?.[18] + '%'},
    {time: '8 PM', chance: filteredRainChance?.[20] + '%'},
    {time: '10 PM', chance: filteredRainChance?.[22] + '%'},
  ];

  const hourlyRainChanceArray = [
    {time: '12 AM', chance: filteredRainChance?.[0] + '%'},
    {time: '1 AM', chance: filteredRainChance?.[1] + '%'},
    {time: '2 AM', chance: filteredRainChance?.[2] + '%'},
    {time: '3 AM', chance: filteredRainChance?.[3] + '%'},
    {time: '4 AM', chance: filteredRainChance?.[4] + '%'},
    {time: '5 AM', chance: filteredRainChance?.[5] + '%'},
    {time: '6 AM', chance: filteredRainChance?.[6] + '%'},
    {time: '7 AM', chance: filteredRainChance?.[7] + '%'},
    {time: '8 AM', chance: filteredRainChance?.[8] + '%'},
    {time: '9 AM', chance: filteredRainChance?.[9] + '%'},
    {time: '10 AM', chance: filteredRainChance?.[10] + '%'},
    {time: '11 AM', chance: filteredRainChance?.[11] + '%'},
    {time: '12 PM', chance: filteredRainChance?.[12] + '%'},
    {time: '1 PM', chance: filteredRainChance?.[13] + '%'},
    {time: '2 PM', chance: filteredRainChance?.[14] + '%'},
    {time: '3 PM', chance: filteredRainChance?.[15] + '%'},
    {time: '4 PM', chance: filteredRainChance?.[16] + '%'},
    {time: '5 PM', chance: filteredRainChance?.[17] + '%'},
    {time: '6 PM', chance: filteredRainChance?.[18] + '%'},
    {time: '7 PM', chance: filteredRainChance?.[19] + '%'},
    {time: '8 PM', chance: filteredRainChance?.[20] + '%'},
    {time: '9 PM', chance: filteredRainChance?.[21] + '%'},
    {time: '10 PM', chance: filteredRainChance?.[22] + '%'},
    {time: '11 PM', chance: filteredRainChance?.[23] + '%'},
  ];

  const getSelectedTempData = (selectedOption: string) => {
    if (selectedOption === buttonOptions.summary) {
      return summaryTempArray;
    } else if (selectedOption === buttonOptions.hourly) {
      return hourlyTempArray;
    } else {
      return [];
    }
  };

  const filteredTempData = useMemo(
    () => getSelectedTempData(selectedOption),
    [dayClickedIndex, selectedOption],
  );

  const {width: screenWidth} = useWindowDimensions();

  // Control widths and spacing between data points here
  const tempChartWidth = Math.max(screenWidth, filteredTempData.length * 65);

  const selectedTempData = useMemo(
    () => (selectedOption === buttonOptions.summary ? summaryTempArray : hourlyTempArray),
    [selectedOption, summaryTempArray, hourlyTempArray],
  );

  const selectedRainData = useMemo(
    () =>
      selectedOption === buttonOptions.summary ? summaryRainChanceArray : hourlyRainChanceArray,
    [selectedOption, summaryRainChanceArray, hourlyRainChanceArray],
  );

  const weatherIcons = weatherCode.map((code: number) => getWeatherIcon(getWeatherLabel(code)));
  const filteredWeatherIcons = weatherIcons.slice(startHour, endHour);

  const summaryIconArray = [
    {time: '12 AM', icon: filteredWeatherIcons?.[0]},
    {time: '2 AM', icon: filteredWeatherIcons?.[2]},
    {time: '4 AM', icon: filteredWeatherIcons?.[4]},
    {time: '6 AM', icon: filteredWeatherIcons?.[6]},
    {time: '8 AM', icon: filteredWeatherIcons?.[8]},
    {time: '10 AM', icon: filteredWeatherIcons?.[10]},
    {time: '12 PM', icon: filteredWeatherIcons?.[12]},
    {time: '2 PM', icon: filteredWeatherIcons?.[14]},
    {time: '4 PM', icon: filteredWeatherIcons?.[16]},
    {time: '6 PM', icon: filteredWeatherIcons?.[18]},
    {time: '8 PM', icon: filteredWeatherIcons?.[20]},
    {time: '10 PM', icon: filteredWeatherIcons?.[22]},
  ];
  const hourlyIconArray = [
    {time: '12 AM', icon: filteredWeatherIcons?.[0]},
    {time: '1 AM', icon: filteredWeatherIcons?.[1]},
    {time: '2 AM', icon: filteredWeatherIcons?.[2]},
    {time: '3 AM', icon: filteredWeatherIcons?.[3]},
    {time: '4 AM', icon: filteredWeatherIcons?.[4]},
    {time: '5 AM', icon: filteredWeatherIcons?.[5]},
    {time: '6 AM', icon: filteredWeatherIcons?.[6]},
    {time: '7 AM', icon: filteredWeatherIcons?.[7]},
    {time: '8 AM', icon: filteredWeatherIcons?.[8]},
    {time: '9 AM', icon: filteredWeatherIcons?.[9]},
    {time: '10 AM', icon: filteredWeatherIcons?.[10]},
    {time: '11 AM', icon: filteredWeatherIcons?.[11]},
    {time: '12 PM', icon: filteredWeatherIcons?.[12]},
    {time: '1 PM', icon: filteredWeatherIcons?.[13]},
    {time: '2 PM', icon: filteredWeatherIcons?.[14]},
    {time: '3 PM', icon: filteredWeatherIcons?.[15]},
    {time: '4 PM', icon: filteredWeatherIcons?.[16]},
    {time: '5 PM', icon: filteredWeatherIcons?.[17]},
    {time: '6 PM', icon: filteredWeatherIcons?.[18]},
    {time: '7 PM', icon: filteredWeatherIcons?.[19]},
    {time: '8 PM', icon: filteredWeatherIcons?.[20]},
    {time: '9 PM', icon: filteredWeatherIcons?.[21]},
    {time: '10 PM', icon: filteredWeatherIcons?.[22]},
    {time: '11 PM', icon: filteredWeatherIcons?.[23]},
  ];

  const selectedIconsData = useMemo(() => {
    return selectedOption === buttonOptions.summary ? summaryIconArray : hourlyIconArray;
  }, [selectedOption, summaryIconArray, hourlyIconArray]);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleResetScrollView = useCallback(
    () => (scrollViewRef.current ? scrollViewRef.current.scrollTo({y: 0}) : null),
    [],
  );

  const handleSelectOption = useCallback((newOption: string) => {
    setSelectedOption(newOption);
    handleResetScrollView();
  }, []);

  const handlePrevDayPress = useCallback(() => {
    setDayClickedIndex(prevIndex => prevIndex - 1);
  }, [setDayClickedIndex]);

  const handleNextDayPress = useCallback(() => {
    setDayClickedIndex(prevIndex =>
      prevIndex + 1 < forecastDate.length ? prevIndex + 1 : prevIndex,
    );
  }, [setDayClickedIndex, forecastDate]);

  const MemoizedPressableScaleButton = React.memo(PressableScaleButton);

  return (
    <View style={styles.container}>
      <View style={styles.summaryAndToggle}>
        <Text style={styles.summaryText}>Summary</Text>

        <ToggleButton
          buttonOptions={['Summary', 'Hourly']}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
        />
      </View>

      <>
        <View style={styles.datesContainer}>
          <View style={styles.arrowAndDateContainer}>
            {dayClickedIndex > 0 && (
              <MemoizedPressableScaleButton
                style={styles.scaleButtonStyle}
                scale={0.83}
                onPress={handlePrevDayPress}>
                <AntDesignIcon name="leftcircleo" size={30} color="white" />
              </MemoizedPressableScaleButton>
            )}
            <Text style={styles.Date}>{selectedDate}</Text>
          </View>

          <View style={styles.arrowAndDateContainer}>
            <Text style={styles.Date}>{dateNext()}</Text>
            {dayClickedIndex < 13 && (
              <MemoizedPressableScaleButton
                style={styles.scaleButtonStyle}
                scale={0.83}
                onPress={handleNextDayPress}>
                <AntDesignIcon name="rightcircleo" size={30} color="white" />
              </MemoizedPressableScaleButton>
            )}
          </View>
        </View>

        <View style={styles.chartBorder}>
          <ScrollView horizontal ref={scrollViewRef} showsHorizontalScrollIndicator={false}>
            <View style={{width: tempChartWidth}}>
              <View style={styles.tempChartContainer}>
                <LineChart
                  data={{
                    labels: selectedTempData.map(item => item.time),
                    datasets: [{data: selectedTempData.map(item => item.temp || 0)}],
                  }}
                  width={tempChartWidth}
                  height={210}
                  yAxisSuffix=""
                  withOuterLines={false}
                  withInnerLines={false}
                  withHorizontalLabels={false}
                  style={{paddingRight: +40}}
                  yLabelsOffset={10}
                  xLabelsOffset={-160}
                  fromNumber={90} //use this to control curviness of line
                  bezier={false}
                  chartConfig={chartConfig}
                  renderDotContent={({x, y, index}) => (
                    <React.Fragment key={`dot-${index}`}>
                      {/* Temp Values */}
                      <Text style={[styles.tempValues, {left: x - 16, top: -120}]}>
                        {selectedTempData[index]?.temp}°F
                      </Text>

                      {/* Icons */}
                      <View style={[styles.iconContainer, {left: x - 38, top: -190}]}>
                        {selectedIconsData[index]?.icon}
                      </View>

                      {/* Rain Values */}
                      <View>
                        <Text style={[styles.rainValues, {left: x - 18, top: -30}]}>
                          <FontAwesomeIcon name="droplet" size={12} color="white" />{' '}
                          {selectedRainData[index]?.chance}
                        </Text>
                      </View>
                    </React.Fragment>
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
    borderWidth: 5,
    borderRadius: 35,
    borderColor: '#4b5e94',
    flexDirection: 'column',
    padding: 15,
    backgroundColor: '#4b5e9434',
  },

  summaryAndToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  datesContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  Date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  arrowAndDateContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  chartBorder: {
    borderColor: '#4b5e94',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },

  scaleButtonStyle: {
    padding: 5,
  },

  tempChartContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  rainChartContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  tempValues: {
    position: 'absolute',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  rainValues: {
    position: 'absolute',
    color: 'white',
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto',
  },

  iconContainer: {
    width: 80,
    height: 75,
    transform: [{scale: 0.4}],
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

type SummaryChartProps = {
  rain: number[];
  temps: number[];
  forecastDate: string[];
  dayClickedIndex: number;
  setDayClickedIndex: React.Dispatch<React.SetStateAction<number>>;
  weatherCode: number[];
};
