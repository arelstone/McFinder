import React, { Fragment } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import { PlacesApiResponse } from './interfaces/PlacesApiResponse';
import { fetchPlaces } from './interfaces/api/fetchPlaces';
import colors from './colors';

interface Props { }

interface State {
  watcherId: number | null;
  coords: {
    latitude: number | undefined;
    longitude: number | undefined;
    heading: number | undefined;
  },
  results?: PlacesApiResponse[];
}


export default class App extends React.Component<Props, State>{

  state: State = {
    watcherId: null,
    coords: {
      longitude: undefined,
      latitude: undefined,
      heading: undefined,
    },
    results: []
  }


  componentDidMount() {
    // if (hasLocationPermission) {
    Geolocation.watchPosition(
      (position) => {
        const { coords } = position;

        this.setState({
          coords: {
            ...this.state.coords,
            latitude: coords.latitude,
            longitude: coords.longitude,
            heading: Number(coords.heading),
          },
        }, async () => {
          const results = this.state.coords && await fetchPlaces(this.state.coords);

          this.setState({ results })
        });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    // }
  }

  componentWillUnmount() {
    const { watcherId }: State = this.state;
    watcherId && navigator.geolocation.clearWatch(watcherId);
  }

  render() {
    const { coords: { latitude, longitude }, results }: State = this.state;
    const distanceInMeter = Boolean(latitude)
      && Boolean(longitude)
      && results
      && Boolean(results.length > 0)
      && getDistance(
        { lat: latitude, lng: longitude },
        { ...results[0].geometry.location });

    return <SafeAreaView
      style={styles.appContainer}
    >
      <Fragment>
        <Text>Position:</Text>
        {
          <View>
            {longitude && <Text>Longitude: {longitude}</Text>}
            {latitude && <Text>Latitude: {latitude}</Text>}
            <Text>Distance: {distanceInMeter}meter</Text>
          </View>
        }
      </Fragment>
    </SafeAreaView>;
  }
}



const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.black,
  }
})
