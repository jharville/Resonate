import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SemiCircleGauge} from './SemiCircleGauge';

type MinutesStyles = {
  [key: string]: {
    color: string;
  };
};

const minutesStyles: MinutesStyles = {
  low: {color: '#8bba24'},
  moderate: {color: '#F7EA48'},
  high: {color: '#FFC100'},
  veryHigh: {color: '#ff6f00'},
  extreme: {color: '#EF3340'},
  noData: {color: 'gray'},
};

type PrecautionMessages = {
  [key: string]: {
    text: string[];
    icons: string[];
  };
};

const precautionMessages: PrecautionMessages = {
  low: {
    text: ['Lotion', 'Sunglasses'],
    icons: ['lotion', 'sunglasses'],
  },
  moderate: {
    text: ['Lotion', 'Sunglasses', 'Hat', 'Shade'],
    icons: ['lotion', 'sunglasses', 'redhat', 'beach'],
  },
  high: {
    text: ['Lotion', 'Sunglasses', 'Hat', 'Shade', 'Clothing'],
    icons: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
  },
  veryHigh: {
    text: ['Lotion', 'Sunglasses', 'Hat', 'Clothing', 'Shade'],
    icons: ['lotion', 'sunglasses', 'redhat', 'tshirt-crew', 'beach'],
  },
  extreme: {
    text: ['Lotion', 'Sunglasses', 'Hat', 'Clothing', 'Shade'],
    icons: ['lotion', 'sunglasses', 'redhat', 'tshirt-crew', 'beach'],
  },
  noData: {
    text: ['N/A'],
    icons: [],
  },
};

type labelTypes = {
  name: string;
  labelColor: string;
  activeBarColor: string;
};
const labels: labelTypes[] = [
  {name: '1', labelColor: '#688D1B', activeBarColor: '#688D1B'}, // Dark Green
  {name: '2', labelColor: '#7bae02', activeBarColor: '#7cb004'}, // Green
  {name: '3', labelColor: '#97D700', activeBarColor: '#97D700'}, // Light Green
  {name: '4', labelColor: '#F7EA48', activeBarColor: '#d3db3f'}, // Yellow
  {name: '5', labelColor: '#FCE300', activeBarColor: '#fcec05'}, // Bright Yellow
  {name: '6', labelColor: '#FFC100', activeBarColor: '#FFC100'}, // Orange-Yellow
  {name: '7', labelColor: '#FCA514', activeBarColor: '#eb9d15'}, // Orange
  {name: '8', labelColor: '#FF8200', activeBarColor: '#f07c00'}, // Deep Orange
  {name: '9', labelColor: '#EF3340', activeBarColor: '#EF3340'}, // Bright Red
  {name: '10', labelColor: '#7b1a1a', activeBarColor: '#7b1a1a'}, // Dark Red
];
type switchReturnTypes = {
  conditionText: string;
  gaugeChartValue: number;
  spfRecommendation: string;
  minutesToBurn: string;
  switchWarningMessage: {text: string[]; icons: string[]};
  labels: labelTypes[];
  minutesStyle: {color: string};
};
const getUVSwitchResult = (uvValue: number): switchReturnTypes => {
  let conditionText = 'No Data';
  let gaugeChartValue = 1;
  let spfRecommendation = '';
  let minutesToBurn = '';
  let switchWarningMessage = precautionMessages.noData;
  let minutesStyle = minutesStyles.noData;

  switch (uvValue) {
    case 1:
      conditionText = 'Low';
      gaugeChartValue = 1;
      spfRecommendation = '15';
      minutesToBurn = '60';
      switchWarningMessage = precautionMessages.low;
      minutesStyle = minutesStyles.low;
      break;
    case 2:
      conditionText = 'Low';
      gaugeChartValue = 2;
      spfRecommendation = '15';
      minutesToBurn = '60';
      switchWarningMessage = precautionMessages.low;
      minutesStyle = minutesStyles.low;
      break;
    case 3:
      conditionText = 'Low';
      gaugeChartValue = 3;
      spfRecommendation = '30+';
      minutesToBurn = '50';
      switchWarningMessage = precautionMessages.low;
      minutesStyle = minutesStyles.low;
      break;
    case 4:
      conditionText = 'Moderate';
      gaugeChartValue = 4;
      spfRecommendation = '30+';
      minutesToBurn = '45';
      switchWarningMessage = precautionMessages.moderate;
      minutesStyle = minutesStyles.moderate;
      break;
    case 5:
      conditionText = 'Moderate';
      gaugeChartValue = 5;
      spfRecommendation = '30+';
      minutesToBurn = '45';
      switchWarningMessage = precautionMessages.moderate;
      minutesStyle = minutesStyles.moderate;
      break;
    case 6:
      conditionText = 'High';
      gaugeChartValue = 6;
      spfRecommendation = '50';
      minutesToBurn = '30';
      switchWarningMessage = precautionMessages.high;
      minutesStyle = minutesStyles.high;
      break;
    case 7:
      conditionText = 'High';
      gaugeChartValue = 7;
      spfRecommendation = '50';
      minutesToBurn = '30';
      switchWarningMessage = precautionMessages.high;
      minutesStyle = minutesStyles.high;
      break;
    case 8:
      conditionText = 'Very High';
      gaugeChartValue = 8;
      spfRecommendation = '50';
      minutesToBurn = '15';
      switchWarningMessage = precautionMessages.veryHigh;
      minutesStyle = minutesStyles.veryHigh;
      break;
    case 9:
      conditionText = 'Very High';
      gaugeChartValue = 9;
      spfRecommendation = '50';
      minutesToBurn = '15';
      switchWarningMessage = precautionMessages.veryHigh;
      minutesStyle = minutesStyles.veryHigh;
      break;
    case 10:
      conditionText = 'Extreme!';
      gaugeChartValue = 10;
      spfRecommendation = '50+';
      minutesToBurn = '10';
      switchWarningMessage = precautionMessages.extreme;
      minutesStyle = minutesStyles.extreme;

      break;
  }

  return {
    gaugeChartValue,
    conditionText,
    spfRecommendation,
    minutesToBurn,
    labels,
    switchWarningMessage,
    minutesStyle,
  };
};

export const UVBox = ({uvValue, sunDuration}: UVBoxProps) => {
  const {
    gaugeChartValue,
    conditionText,
    spfRecommendation,
    minutesToBurn,
    switchWarningMessage,
    minutesStyle,
  } = getUVSwitchResult(uvValue);

  return (
    <View style={styles.container}>
      {/* Left Container */}

      <View style={styles.leftContainer}>
        <Text style={styles.uvIndexText}>UV Index</Text>

        <SemiCircleGauge segments={10} size={160} needleColor={'white'} value={gaugeChartValue} />

        <View>
          <Text style={styles.riskText}>Risk:</Text>
          <Text style={[styles.riskText, minutesStyle]}>{conditionText}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Minutes to Burn:</Text>
            <Text style={[styles.minutesBurnNumber, minutesStyle]}>{minutesToBurn}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Suggested SPF:</Text>
            <Text style={styles.spfNumbers}>{spfRecommendation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Total Sun Hours:</Text>
            <Text style={styles.sunHoursNumber}>{sunDuration}</Text>
          </View>
        </View>
      </View>

      {/* Right Container */}
      <View style={styles.rightContainer}>
        <View style={styles.suggestionContainer}>
          <Text style={styles.protectYourselfText}>
            Protect yourself if you're going out any longer than {minutesToBurn} minutes!
          </Text>
          <Text style={styles.protectNeededText}>Protection needed:</Text>
          {/* Info */}
          <View style={styles.iconTextContainer}>
            {switchWarningMessage.icons.map((icon, index) => (
              <View key={index} style={styles.iconWithText}>
                <MaterialCommunityIcons name={icon} size={26} color="black" />
                <Text style={styles.warningText}>{switchWarningMessage.text[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    borderWidth: 5,
    borderRadius: 35,
    borderColor: '#4b5e94',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#4b5e9434',
  },

  leftContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(48,49,49)',
    borderRadius: 20,
    gap: 5,
  },

  rightContainer: {
    flex: 1,
    backgroundColor: 'rgb(238, 238, 238)',
    borderRadius: 20,
  },

  infoContainer: {
    flexDirection: 'column',
  },

  infoRow: {
    gap: 5,
    flexDirection: 'row',
  },

  infoText: {
    textAlign: 'left',
    color: 'white',
    fontSize: 15,
    fontWeight: 500,
  },

  suggestionContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    gap: 5,
  },

  protectYourselfText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 500,
  },

  protectNeededText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 500,
  },

  uvIndexText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  riskText: {
    textAlign: 'center',

    color: 'white',
    fontSize: 25,
    fontWeight: 400,
  },

  uvValueText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  iconTextContainer: {
    flexDirection: 'column',
    gap: 8,
  },

  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  minutesBurnNumber: {
    fontWeight: 'bold',
  },

  spfNumbers: {
    color: 'rgb(0, 177, 253)',
    fontWeight: 'bold',
  },

  sunHoursNumber: {
    color: 'yellow',
    fontWeight: 'bold',
  },

  warningText: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgb(88, 101, 101)',
  },
});

type UVBoxProps = {
  uvValue: number;
  sunDuration: number;
};
