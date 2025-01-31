import React from 'react';
import {View} from 'react-native';
import Svg, {Path, G, Circle, Text} from 'react-native-svg';
import * as d3 from 'd3-shape';

export const SemiCircleGauge = ({
  segments,
  size,
  backgroundColor,
  needleColor,
  value,
}: SemiCircleGaugeProps) => {
  // Calculates radius based on size
  const radius = size / 2;
  // Padding between segments
  const segmentPadding = 0.04;
  // Corner radius for rounded segment edges
  const cornerRadius = 3.5;

  const colors: string[] = [
    '#4CAF50', // Green
    '#8BC34A', // Light Green
    '#CDDC39', // Lime
    '#FFEB3B', // Yellow
    '#FFC107', // Amber
    '#FF9800', // Orange
    '#FF5722', // Deep Orange
    '#F44336', // Red
    '#D32F2F', // Dark Red
    '#9C27B0', // Purple
    '#3F51B5', // Blue
  ];

  // Generates an array of arc paths for each segment
  const arcPaths = Array.from({length: segments}).map((_, index) => {
    const arcGenerator = d3.arc().cornerRadius(cornerRadius);

    return arcGenerator({
      innerRadius: radius - size * 0.13,
      outerRadius: radius,
      startAngle: (index * Math.PI) / segments + segmentPadding,
      endAngle: ((index + 1) * Math.PI) / segments - segmentPadding,
    });
  });

  const arrowAngle = (() => {
    switch (value) {
      case 1:
        return 0;
      case 2:
        return 20;
      case 3:
        return 40;
      case 4:
        return 60;
      case 5:
        return 80;
      case 6:
        return 100;
      case 7:
        return 120;
      case 8:
        return 140;
      case 9:
        return 160;
      case 10:
        return 180;
      case 11:
        return 200;
      default:
        return 0;
    }
  })();

  const arrowPath = `M 0 -${radius * 0.5} L ${radius * 0.1} -${radius * 0.4} L -${radius * 0.1} -${
    radius * 0.4
  } Z`;

  const baseLayerCircle = (
    <Circle
      cx="15"
      cy="0"
      r={radius * 0.265} //change thickness
      fill="black"
    />
  );

  const overlayCircleRing = (
    <Circle
      cx="15"
      cy="0"
      r={radius * 0.2} //Change thickness
      fill="none"
      stroke="#5af8f3"
      strokeWidth={radius * 0.02}
    />
  );

  const circleNumber = (
    <Text
      x={0.5}
      y={-13}
      fontSize={radius * 0.3} // font size
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
      alignmentBaseline="middle">
      {value}
    </Text>
  );

  return (
    <View style={{backgroundColor}}>
      <Svg height={100} width={size} viewBox={`0 0 ${size} ${size / 2}`}>
        <G x={size / 2} y={size / 2} transform={'rotate(-90)'}>
          {/* Renders each segment */}
          {arcPaths.map((path, index) => (
            <Path key={index} d={path || ''} fill={colors[index % colors.length]} />
          ))}

          {/* Renders the arrow */}
          <G transform={`translate(${radius * 0.1}, 0) rotate(${arrowAngle})`}>
            <Path d={arrowPath} fill={needleColor} />
          </G>

          {/* Render the circle at the base of the needle */}
          {baseLayerCircle}
          {overlayCircleRing}
          <G transform={'rotate(90)'}>{circleNumber}</G>
        </G>
      </Svg>
    </View>
  );
};

type SemiCircleGaugeProps = {
  segments: number;
  size: number;
  backgroundColor?: string;
  needleColor: string;
  value: number;
};
