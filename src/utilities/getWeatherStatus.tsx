import React from 'react';
import {Text, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Stored in getWeatherStatus file.
 * Retrieves the general weather conditions corresponding to the given weather code based on the city entered.
 *
 * This function searches through a list of WMO (World Meteorological Organization) codes to find
 * the label associated with the provided weather code. If no match is found, it returns N/A.
 */
export enum WeatherStatuses {
  Clear = 'Clear',
  MainlyClear = 'Mainly Clear',
  PartlyCloudy = 'Partly Cloudy',
  Overcast = 'Cloudy',
  Foggy = 'Foggy',
  DrizzlingLightly = 'Light Drizzle',
  DrizzlingModerately = 'Moderate Drizzle',
  DrizzlingDense = 'Dense Drizzle',
  DrizzlingFreezingLight = 'Light Freezing Drizzle',
  DrizzlingFreezingDense = 'Dense Freezing Drizzle',
  RainingLight = 'Light Rain',
  RainingModerate = 'Moderate Rain',
  RainingHeavy = 'Heavy Rain',
  FreezingRainLight = 'Light Freezing Rain',
  FreezingRainHeavy = 'Heavy Freezing Rain',
  SnowFallLight = 'Light Snow Fall',
  SnowFallModerate = 'Moderate Snow Fall',
  SnowFallHeavy = 'Heavy Snow Fall',
  SnowShowersLight = 'Light Snow Showers',
  SnowShowersHeavy = 'Heavy Snow Showers',
  SnowGrains = 'Snow Grains',
  RainShowersLight = 'Slight Rain Showers',
  RainShowersModerate = 'Moderate Rain Showers',
  RainShowersViolent = 'Violent Rain Showers',
  Thunderstorms = 'Thunderstorms',
  ThunderstormsLightHail = 'T-storms w/ Light Hail',
  ThunderstormsHeavyHail = 'T-storms w/ Heavy Hail',
}

// Weather Codes pulled from Open Mateo
export const WMOs = [
  {WMOCodes: [0], label: WeatherStatuses.Clear},
  {WMOCodes: [1], label: WeatherStatuses.MainlyClear},
  {WMOCodes: [2], label: WeatherStatuses.PartlyCloudy},
  {WMOCodes: [3], label: WeatherStatuses.Overcast},
  {WMOCodes: [45, 48], label: WeatherStatuses.Foggy},
  {WMOCodes: [51], label: WeatherStatuses.DrizzlingLightly},
  {WMOCodes: [53], label: WeatherStatuses.DrizzlingModerately},
  {WMOCodes: [55], label: WeatherStatuses.DrizzlingDense},
  {WMOCodes: [56], label: WeatherStatuses.DrizzlingFreezingLight},
  {WMOCodes: [57], label: WeatherStatuses.DrizzlingFreezingDense},
  {WMOCodes: [61], label: WeatherStatuses.RainingLight},
  {WMOCodes: [63], label: WeatherStatuses.RainingModerate},
  {WMOCodes: [65], label: WeatherStatuses.RainingHeavy},
  {WMOCodes: [66], label: WeatherStatuses.FreezingRainLight},
  {WMOCodes: [67], label: WeatherStatuses.FreezingRainHeavy},
  {WMOCodes: [71], label: WeatherStatuses.SnowFallLight},
  {WMOCodes: [73], label: WeatherStatuses.SnowFallModerate},
  {WMOCodes: [75], label: WeatherStatuses.SnowFallHeavy},
  {WMOCodes: [85], label: WeatherStatuses.SnowShowersLight},
  {WMOCodes: [86], label: WeatherStatuses.SnowShowersHeavy},
  {WMOCodes: [77], label: WeatherStatuses.SnowGrains},
  {WMOCodes: [80], label: WeatherStatuses.RainShowersLight},
  {WMOCodes: [81], label: WeatherStatuses.RainShowersModerate},
  {WMOCodes: [82], label: WeatherStatuses.RainShowersViolent},
  {WMOCodes: [95], label: WeatherStatuses.Thunderstorms},
  {WMOCodes: [96], label: WeatherStatuses.ThunderstormsLightHail},
  {WMOCodes: [99], label: WeatherStatuses.ThunderstormsHeavyHail},
];

/**
 * Retrieves the general weather label for a given weather code.
 * @param {number} weatherCode - The weather code.
 * @returns {string} - The corresponding weather label or "N/A" if not found.
 */
export const getWeatherLabel = (weatherCode: number): WeatherStatuses => {
  const locatedWMOObject = WMOs.find(wmoObj => wmoObj.WMOCodes.includes(weatherCode));
  return locatedWMOObject?.label || WeatherStatuses.Clear;
};

/**
 * Retrieves the weather icon corresponding to the given weather status.
 * Returns a React component for the weather icon based on the provided weather status.
 * If the status does not match any predefined conditions, a default sun icon is returned.
 *
 * @param {WeatherStatus} status - The weather status string.
 * @returns {JSX.Element} - A React element for the weather icon.
 */

export const getWeatherIcon = (status: WeatherStatuses) => {
  switch (status) {
    case WeatherStatuses.Clear:
      return <FontAwesome6 name="sun" color="goldenrod" size={70} solid />;
    case WeatherStatuses.MainlyClear:
      return <FontAwesome6 name="sun" color="goldenrod" size={70} solid />;
    case WeatherStatuses.PartlyCloudy:
      return <MaterialCommunityIcons name="weather-partly-cloudy" color="white" size={80} />;
    case WeatherStatuses.Overcast:
      return <FontAwesome5 name="cloud" color="white" size={60} />;
    case WeatherStatuses.Foggy:
      return <MaterialCommunityIcons name="weather-fog" color="grey" size={90} />;
    case WeatherStatuses.DrizzlingLightly:
      return <Ionicons name="rainy-outline" size={85} color="white" />;
    case WeatherStatuses.DrizzlingModerately:
      return <Ionicons name="rainy" size={80} color="white" />;
    case WeatherStatuses.DrizzlingDense:
      return <Ionicons name="rainy-sharp" size={80} color="grey" />;
    case WeatherStatuses.DrizzlingFreezingLight:
      return <MaterialCommunityIcons name="weather-snowy-rainy" color="white" size={88} />;
    case WeatherStatuses.DrizzlingFreezingDense:
      return <MaterialCommunityIcons name="weather-snowy-heavy" color="grey" size={88} />;
    case WeatherStatuses.RainingLight:
      return <FontAwesome5 name="cloud-rain" size={75} color="grey" />;
    case WeatherStatuses.RainingModerate:
      return <FontAwesome5 name="cloud-showers-heavy" size={75} color="white" />;
    case WeatherStatuses.RainingHeavy:
      return <FontAwesome5 name="cloud-showers-heavy" size={75} color="grey" />;
    case WeatherStatuses.FreezingRainLight:
      return <MaterialCommunityIcons name="weather-hail" color="grey" size={90} />;
    case WeatherStatuses.FreezingRainHeavy:
      return <MaterialCommunityIcons name="weather-snowy-heavy" color="grey" size={90} />;
    case WeatherStatuses.SnowFallLight:
      return <FontAwesome5 name="snowflake" color="white" size={75} />;
    case WeatherStatuses.SnowFallModerate:
      return <FontAwesome5 name="snowflake" color="white" size={75} />;
    case WeatherStatuses.SnowFallHeavy:
      return <FontAwesome5 name="snowflake" color="grey" size={80} />;
    case WeatherStatuses.SnowGrains:
      return <FontAwesome name="asterisk" color="white" size={60} />;
    case WeatherStatuses.RainShowersLight:
      return <FontAwesome5 name="cloud-sun-rain" color="white" size={75} />;
    case WeatherStatuses.RainShowersModerate:
      return <FontAwesome5 name="cloud-rain" color="white" size={75} />;
    case WeatherStatuses.RainShowersViolent:
      return <FontAwesome5 name="cloud-showers-heavy" color="grey" size={75} />;
    case WeatherStatuses.Thunderstorms:
      return <MaterialCommunityIcons name="weather-lightning" color="grey" size={90} />;
    case WeatherStatuses.ThunderstormsLightHail:
      return <MaterialCommunityIcons name="weather-lightning-rainy" color="grey" size={90} />;
    case WeatherStatuses.ThunderstormsHeavyHail:
      return <MaterialCommunityIcons name="weather-lightning-heavy" color="grey" size={90} />;
    default:
      return (
        <View>
          <Text style={{color: 'white'}}>Default Returned</Text>
          {/* <FontAwesome6 name="sun" color="goldenrod" size={70} /> */}
        </View>
      );
  }
};
