import { View, Alert } from 'react-native';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import * as Location from "expo-location";
import { getAreaOfPolygon, getPathLength, getCenterOfBounds } from 'geolib';
import { useRouter } from 'expo-router';
import { MeasurementDisplay, ResetMeasurementsButton, SaveMeasurementsButton, Map, ToggleDeleteModeButton, DeleteMarkersButton, DeleteOptionsBottomSheet } from '../components';
import { useStorage } from '../hooks';


export default function TapMeasure() {
  const router = useRouter();  

  const bottomSheetRef = useRef();

  const [ region, setRegion ] = useState(null);
  const [ polygonCoordinates, setPolygonCoordinates ] = useState([])
  const [ polygonArea, setPolygonArea ] = useState()
  const [ polygonDistance, setPolygonDistance ] = useState()
  const [ mapType, setMapType ] = useState("")
  const [ areaVisible, setAreaVisible ] = useState(true)
  const [ deleteMode, setDeleteMode ] = useState(false)
  const [ markersToDelete, setMarkersToDelete ] = useState([])
  const [ previousCoordinates, setPreviousCoordinates ] = useState([])

  // check if location permission is granted
    // if so, set initial region as current location
  useEffect(() => {
    useStorage('get', 'mapPreferences').then(value => setMapType(value))
    const getInitialLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location services in your phone settings to use this feature.",
          [
            { text: "Go Back", style: "cancel", onPress: () => router.back()}
          ]
        )
        return;
      } 

    };
    getInitialLocation();
    getCurrentMap()
  }, []);

  useEffect(() => {
    if (polygonCoordinates.length > 1) {
      setPolygonDistance(getPathLength(polygonCoordinates))
      setPolygonArea(getAreaOfPolygon(polygonCoordinates))
      useStorage('set', 'currentTapCoordinates', polygonCoordinates)
    }
  }, [polygonCoordinates])

  // get the current map from storage or set the map to the user's current location
  const getCurrentMap = async () => {
    const value = await useStorage('get', 'currentTapCoordinates')

    if (value !== null) {
      setPolygonCoordinates(value)
      setRegion(getCenterOfBounds(value))

    } else {
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }

  // add a new location to the polygon
  const addLocationToPolygon = async (location) => {
    if (polygonCoordinates.includes(location) === false) await setPolygonCoordinates([{ latitude: location.latitude, longitude: location.longitude}, ...polygonCoordinates])
  }

  const removeLocationFromPolygon = async (location) => {
    await setPolygonCoordinates(polygonCoordinates.filter(coordinate => coordinate.latitude !== location.latitude && coordinate.longitude !== location.longitude))
  }

  // reset the polygon coordinates and measurements
  const resetMeasurements = () => {
    bottomSheetRef.current.close()
    setMarkersToDelete([])
    useStorage('remove', 'currentTapCoordinates')
    setPolygonCoordinates([])
    setPolygonArea(null)
    setPolygonDistance(null)
  }

  return (
    <View className="flex-1 items-center justify-center">
      {region && (
        <Map 
          region={region}
          polygonCoordinates={polygonCoordinates}
          mapType={mapType}
          tappable={true}
          addLocationToPolygon={addLocationToPolygon}
          areaVisible={areaVisible}
          deleteMode={deleteMode}
          markersToDelete={markersToDelete}
          setMarkersToDelete={setMarkersToDelete}/>
      )}

      <MeasurementDisplay 
        polygonArea={polygonArea} 
        polygonDistance={polygonDistance}
        setMapType={setMapType}
        distanceAround={true}
        areaVisible={areaVisible}
        setAreaVisible={setAreaVisible} />

      <View className="absolute bottom-0 w-full items-center" style={{gap: 8}}>
        <View className="w-full flex flex-row justify-between mb-14 p-4 rounded-lg">
          <ToggleDeleteModeButton
            setDeleteMode={setDeleteMode}
            setMarkersToDelete={setMarkersToDelete}
            deleteMode={deleteMode}
            mapType={mapType} />

          <SaveMeasurementsButton polygonCoordinates={polygonCoordinates} polygonArea={polygonArea} polygonDistance={polygonDistance} mapType={mapType}/>
        </View>
      </View>

      <DeleteOptionsBottomSheet
        bottomSheetRef={bottomSheetRef}
        deleteMode={deleteMode}
        setDeleteMode={setDeleteMode}
        setPolygonCoordinates={setPolygonCoordinates}
        previousCoordinates={previousCoordinates}
        setPreviousCoordinates={setPreviousCoordinates}
        setMarkersToDelete={setMarkersToDelete}
        >
            <DeleteMarkersButton 
              polygonCoordinates={polygonCoordinates}
              setPolygonCoordinates={setPolygonCoordinates}
              markersToDelete={markersToDelete}
              setMarkersToDelete={setMarkersToDelete}
              mapType={mapType}
              resetMeasurements={resetMeasurements}
              previousCoordinates={previousCoordinates}
              setPreviousCoordinates={setPreviousCoordinates} />

            <ResetMeasurementsButton resetMeasurements={resetMeasurements} mapType={mapType} markersToDelete={markersToDelete} polygonCoordinatesLength={polygonCoordinates.length}/>
      </DeleteOptionsBottomSheet>

    </View>
  );
}