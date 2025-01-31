import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, ViewStyle} from 'react-native';
import {format, parseISO} from 'date-fns';
import {getWeatherLabel, getWeatherIcon, WeatherStatuses} from '../utilities/getWeatherStatus';

enum DaySpanOptions {
  Seven = 7,
  Fourteen = 14,
}

export const ForecastBox = ({
  WeatherCode,
  maxTemp,
  minTemp,
  forecastDates,
  onDaySelect,
}: ForecastBoxProps) => {
  const [selectedDaySpanOption, setSelectedDaySpanOption] = useState<DaySpanOptions>(
    DaySpanOptions.Seven,
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0);

  const styles = useStyles({selectedDaySpanOption});

  const handleSelectOption = useCallback((selectedOption: DaySpanOptions) => {
    setSelectedDaySpanOption(selectedOption);
  }, []);

  const handleDayClick = useCallback(
    (index: number) => {
      onDaySelect(index); // Notifies the parent component about the selected day
      setSelectedDayIndex(index);
    },
    [onDaySelect],
  );

  const renderForecastItem = useCallback(
    ({item, index}: IRenderForecastItemProps) => {
      const isSelected = selectedDayIndex === index;

      const getDateStyles = (isSelected: boolean) => {
        return isSelected ? styles.selectedDayStyle : styles.unselectedDatesStyle;
      };

      return (
        <TouchableOpacity onPress={() => handleDayClick(index)}>
          <View style={getDateStyles(isSelected)}>
            <View style={styles.dateContainer}>
              <Text style={styles.dayStyle}>{format(parseISO(item), 'EEE')}</Text>
              <Text style={styles.monthAndDateStyle}>{format(parseISO(item), 'MMM, do')}</Text>
            </View>

            <View style={styles.iconAndConditionContainer}>
              <View style={styles.iconContainer}>
                {getWeatherIcon(getWeatherLabel(WeatherCode[index]))}
              </View>

              <Text style={styles.generalConditionStyle}>
                {getWeatherLabel(WeatherCode[index])}
              </Text>
            </View>

            <View>
              <Text style={styles.tempContainer}>
                {Math.round(minTemp[index])} / {Math.round(maxTemp[index]) + ' \u00B0F'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [
      WeatherCode,
      handleDayClick,
      maxTemp,
      minTemp,
      styles.dateContainer,
      styles.dayStyle,
      styles.generalConditionStyle,
      styles.iconAndConditionContainer,
      styles.iconContainer,
      styles.unselectedDatesStyle,
      styles.monthAndDateStyle,
      styles.tempContainer,
    ],
  );

  return (
    <View style={styles.forecastBoxStyle}>
      <View style={styles.forecastTextAndButtons}>
        <Text style={styles.forecastText}>Forecast</Text>
        <View style={styles.daySelectorContainer}>
          <View style={styles.sevenButton}>
            <TouchableOpacity
              hitSlop={12}
              onPressIn={() => handleSelectOption(DaySpanOptions.Seven)}>
              <Text style={styles.paramText}>7 Day</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fourteenButton}>
            <TouchableOpacity
              hitSlop={12}
              onPressIn={() => handleSelectOption(DaySpanOptions.Fourteen)}>
              <Text style={styles.paramText}>14 Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FlatList
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={false}
        data={forecastDates.slice(0, selectedDaySpanOption)}
        renderItem={renderForecastItem}
      />
    </View>
  );
};

const baseButtonStyle: ViewStyle = {
  flexDirection: 'row',
  borderRadius: 8,
  borderWidth: 3,
  backgroundColor: '#afb0b7',
  maxWidth: 100,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 5,
};

const selectedButtonStyle: ViewStyle = {
  ...baseButtonStyle,
  backgroundColor: '#196cf1',
};

const useStyles = ({selectedDaySpanOption}: {selectedDaySpanOption?: DaySpanOptions}) => {
  const isSevenSelected = selectedDaySpanOption === DaySpanOptions.Seven;
  const isFourteenSelected = selectedDaySpanOption === DaySpanOptions.Fourteen;
  return StyleSheet.create({
    forecastBoxStyle: {
      gap: 15,
      borderWidth: 5,
      borderRadius: 35,
      borderColor: '#4b5e94',
      flexDirection: 'column',
      padding: 15,
      backgroundColor: '#4b5e9434',
    },

    forecastTextAndButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    daySelectorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
      borderRadius: 8,
      backgroundColor: '#1b4a7c',
      paddingVertical: 5,
      paddingHorizontal: 5,
    },

    sevenButton: isSevenSelected ? selectedButtonStyle : baseButtonStyle,
    fourteenButton: isFourteenSelected ? selectedButtonStyle : baseButtonStyle,
    paramText: {
      color: 'black',
      fontWeight: 'bold',
    },

    forecastText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
    },

    unselectedDatesStyle: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      borderWidth: 2,
      borderRadius: 15,
      borderColor: '#4b5e94',
      alignItems: 'center',
    },

    selectedDayStyle: {
      backgroundColor: '#1b4a7c',
      borderColor: '#1f6fb2',
      flexDirection: 'row',
      paddingHorizontal: 10,
      borderWidth: 2,
      borderRadius: 15,
      alignItems: 'center',
    },

    itemSeparator: {
      paddingVertical: 4,
    },

    dateContainer: {flex: 1},
    iconAndConditionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 5,
      width: 180,
    },

    iconContainer: {
      transform: [{scale: 0.7}],
      alignItems: 'center',
      overflow: 'hidden',
      width: 88,
      height: 80,
      justifyContent: 'center',
    },

    generalConditionStyle: {
      color: 'white',
      flexShrink: 1,
    },

    dayStyle: {
      flexDirection: 'column',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },

    monthAndDateStyle: {
      fontSize: 14,
      color: 'white',
    },

    tempContainer: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
  });
};

const ItemSeparatorComponent = () => {
  const styles = useStyles({});
  return <View style={styles.itemSeparator} />;
};

interface IRenderForecastItemProps {
  item: string;
  index: number;
}

type ForecastBoxProps = {
  generalWeatherCondition: WeatherStatuses;
  WeatherCode: number[];
  maxTemp: number[];
  minTemp: number[];
  forecastDates: string[];

  onDaySelect: (index: number) => void;
};
