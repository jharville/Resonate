import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(
  'pk.eyJ1Ijoiam9zZXBoaGFydmlsbGU5NiIsImEiOiJjbTBiZnd1OHEwM2VlMnJvdGE4eDdhZWJjIn0.f5ixUJf5mXnHZzIl0rft6Q',
);

export const MapDisplay = ({userSearchedCity}: MapDisplayProps) => {
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);

  const fetchCityCoordinates = useCallback(async (city: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`,
      );
      const data = await response.json();

      if (data.length > 0) {
        const cityCoordinates: [number, number] = [
          parseFloat(data[0].lon),
          parseFloat(data[0].lat),
        ];
        setCoordinates(cityCoordinates);
      } else {
        Alert.alert('City not found', 'Unable to find coordinates for the specified city.');
        setCoordinates([0, 0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch city coordinates.');
      setCoordinates([0, 0]);
    }
  }, []);

  useEffect(() => {
    if (userSearchedCity) {
      fetchCityCoordinates(userSearchedCity);
    }
  }, [userSearchedCity]);

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.mapContainer}>
          <Mapbox.MapView scrollEnabled={false} style={styles.map}>
            <Mapbox.Camera centerCoordinate={coordinates} zoomLevel={userSearchedCity ? 4 : 1} />
            <Mapbox.PointAnnotation
              id="cityMarker"
              coordinate={coordinates}
              title={userSearchedCity}>
              {/* Child element for the PointAnnotation */}
              <View />
            </Mapbox.PointAnnotation>
          </Mapbox.MapView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderRadius: 35,
    borderColor: '#4b5e94',
    flexDirection: 'column',
    backgroundColor: '#4b5e9434',
  },
  map: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 300,
    width: '100%',
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
});

type MapDisplayProps = {
  userSearchedCity: string;
};
