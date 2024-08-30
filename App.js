import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, Polygon} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

export default function App() {
  const [location, setLocation] = useState(null);
  const [source, setSourse] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingSource, setIsChooseingSource] = useState(false);
  const [isChoosingDestination, setIsChooseingDestination] = useState(false);

  




  const defultLocation={
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }



  const getUsersCureentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      console.log(position)
      setLocation({
        latitude:position.coords.altitude,
        longitude:position.coords.longitude,
        latitudeDelta: 47.01,
        longitudeDelta: 45.01,
      })
    });
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('granted');
          getUsersCureentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to show your current location on the map',
          );
        }
      } catch (error) {
        console.warn(error);
      }
    } else {
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleMapPress=(e)=>{
    const coordinate=e.nativeEvent.coordinate
    console.log(coordinate)
    if(isChoosingSource){
      setSourse(coordinate)
      setIsChooseingSource(false)
    }else if(isChoosingDestination){
      setDestination(coordinate)
      setIsChooseingDestination(false)
    }
  }

  const showCoordinates=()=>{
    console.log(source,destination)
  const distance=  getDistance({
      latitude:source.latitude,
      longitude:source.longitude
    },{
      latitude:destination.latitude,
      longitude:destination.longitude
    })/ 1000

    console.log(distance)
  }
  
  return (
    <View style={styles.container}>
      <Text>App</Text>
      <MapView
        style={styles.map}
        region={location}
        // onRegionChangeComplete={data => console.log(data)}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          
          {
            source && (
              <Marker 
                coordinate={source} title={'Source'} pinColor={'green'}
                draggable={true}
                onDragEnd={e=>setSourse(e.nativeEvent.coordinate)}

              />
            )
          }
           {
            destination && (
              <Marker 
                coordinate={destination} title={'Destination'} pinColor={'blue'}
                draggable={true}
                onDragEnd={e=>setDestination(e.nativeEvent.coordinate)}
              />
            )
          }
           {
           source && destination && (
              <Polygon
                coordinate={[source,destination]} strokeColor="#000" pinColor={'blue'} strokeWidth={2}
                
              />
            )
          }
        <Marker
          // coordinate={{
          //   latitude: 37.78825,
          //   longitude: -122.4324,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
          coordinate={location}
          title={'Testing By Parmod '}
          onPress={data => console.log(data.nativeEvent.coordinate)}
          // description={marker.description}
        />

       
      </MapView>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonGroup}>
          {
            source ? (
              <Button title='Remove Source' onPress={()=>setSourse(null)}/>
            )
            :
          <Button title={isChoosingSource? 'Please Choose Source':'Chooose Source'} onPress={()=>setIsChooseingSource(true)}/>
          }
          {
            destination?(
              <Button title='Remove Destination'  onPress={()=>setDestination(null)}/>
            )
            :
          <Button title={isChoosingDestination?'Please Choose Destination':'Chooose Destination'} onPress={()=>setIsChooseingDestination(true)}/>
          }
        </View>
        <Button title='Show Coordinates' onPress={showCoordinates}/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer:{
    position:'absolute',
    bottom:20,
    left:20,
    right:20
  },
  buttonGroup:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:10
  }
});
