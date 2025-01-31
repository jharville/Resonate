import React from 'react';
import {View} from 'react-native';
import Svg, {Circle, Path, G} from 'react-native-svg';
import {parseISO} from 'date-fns';

const width = 130;
const height = 160;
const radius = Math.min(width, height - 20) / 2 - 10;

const daylightArcStyle = {
  stroke: '#c68203', // Color of the arc
  strokeWidth: 4, // Thickness of the arc line
  fill: 'none',
};

const sunTrackerSVGStyle = {
  paddingTop: 5,
};

const sunStyle = {
  fill: 'yellow',
  radius: 10,
};

const isoToMinutes = isoString => {
  if (!isoString) {
    return null;
  }
  const date = parseISO(isoString);
  return date.getHours() * 60 + date.getMinutes();
};

export const SunPositionTracker = ({sunriseTime, sunsetTime, currentTime}) => {
  const sunriseMinutes = isoToMinutes(sunriseTime);
  const sunsetMinutes = isoToMinutes(sunsetTime);
  const currentMinutes = isoToMinutes(currentTime);

  if (sunriseMinutes >= sunsetMinutes || currentMinutes < 0 || currentMinutes > 24 * 60) {
    return null; // check for invalid time range
  }

  const daylightDuration = sunsetMinutes - sunriseMinutes;
  const elapsedMinutes = currentMinutes - sunriseMinutes;

  const progress = Math.max(0, Math.min(elapsedMinutes / daylightDuration, 1));

  const angle = -Math.PI / 2 + progress * Math.PI;
  const sunX = radius * Math.cos(angle);
  const sunY = radius * Math.sin(angle);

  const Arc = (
    <Path
      d={`M 0 ${-radius} 
         A ${radius} ${radius} 0 0 1 0 ${radius}`}
      {...daylightArcStyle}
    />
  );

  const Sun = <Circle cx={sunX} cy={sunY} r={sunStyle.radius} fill={sunStyle.fill} />;
  const transform = `translate(${width / 2}, ${height / 2 - 15}) rotate(-90)`;

  return (
    <View style={sunTrackerSVGStyle}>
      <Svg width={width} height={height}>
        <G transform={transform}>
          {Arc}
          {Sun}
        </G>
      </Svg>
    </View>
  );
};
