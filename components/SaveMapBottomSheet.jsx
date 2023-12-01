import { useMemo, useCallback } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Text, Pressable, View, TextInput, Keyboard, Alert } from 'react-native';
import { useState } from 'react';
import { useStorage } from '../hooks';
import uuid from 'react-native-uuid';
import { Feather } from '@expo/vector-icons';
import { regular, medium, semibold } from '../hooks/useJostFont';

function SaveMapBottomSheet({ polygonCoordinates, saveSheetRef, mapType }) {

  const [ mapName, setMapName ] = useState('')

  const snapPoints = useMemo(() => ["80%"], []);
  const handleSheetChanges = useCallback((index) => {
    if (index !== 0) Keyboard.dismiss()
  }, []);

  const keyboardDismiss = () => {
    Keyboard.dismiss()
    saveSheetRef.current.snapToIndex(0)
  }

  // save the map to storage
    // view in saved maps screen
  const saveMap = async () => {
    if (!mapName) return Alert.alert("Please enter a name for the map")

    try {
      const measurements = await useStorage('get', 'measurementPreferences');
      const value = await useStorage('get', 'savedMaps')

      // create new array or add current map to existing array
      let data
      if (value !== null) {
        data = [
          ...value,
          {
            id: uuid.v4(),
            dateCreated: new Date(),
            mapName,
            mapType,
            polygonCoordinates: polygonCoordinates,
            measurements: measurements,
          }
        ] 
      } else {
        data = [{
          id: uuid.v4(),
          dateCreated: new Date(),
          mapName,
          mapType,
          polygonCoordinates: polygonCoordinates,
          measurements: measurements,
        }]
      }
      await useStorage('set', 'savedMaps', data);

      Alert.alert(`${mapName} saved!`)
      saveSheetRef.current.close()
      Keyboard.dismiss()

    } catch (error) {
      Alert.alert('There was an error saving the map. Please try again.')
    }
  }

  return (
    <BottomSheet
      style={{ flex: 1 }}
      backgroundStyle={{ backgroundColor: '#fff' }}
      ref={saveSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      onPress={keyboardDismiss}>

      <View className="flex-1 px-6 justify-start relative" style={{gap: 16}}>
        
        <View style={{gap: 8}}>
          <Text style={[medium, {fontSize: 20}]}>Enter a name for the map</Text>

          <TextInput
            className="w-full bg-white p-2 rounded-sm border-gray-4 border mb-2 text-gray-8"
            style={regular}
            value={mapName}
            onChangeText={setMapName}
            onFocus={() => saveSheetRef.current.snapToIndex(0)}
            onBlur={() => Keyboard.dismiss()}/>
        </View>

        <View style={{gap: 8}}>
          <Pressable 
            className=" p-4 rounded-2xl shadow-sm flex-row justify-center items-center bg-green-5 active:bg-green-4" 
            style={{gap: 8}}
            onPress={saveMap}>
            <Feather name="download" size={24} color="white" />
            <Text className="text-center text-white" style={[semibold, {fontSize: 22}]}>
              Save Map
            </Text>
          </Pressable>

          <Text className="text-gray-8 text-center" style={regular}>
          (the map will save with the current map type, distance measurement, and area measurement)
          </Text>
        </View>

      </View>

    </BottomSheet>
  )
}

export default SaveMapBottomSheet