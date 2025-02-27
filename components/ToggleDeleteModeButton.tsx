import { Text, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { medium } from "../hooks/useJostFont";

type Coordinate = { latitude: number; longitude: number };

interface ToggleDeleteModeButtonProps {
  deleteMode: boolean;
  setDeleteMode: (boolean) => void;
  setMarkersToDelete: (markers: Coordinate[]) => void;
  mapType: string;
}

const ToggleDeleteModeButton = ({
  setDeleteMode,
  setMarkersToDelete,
  mapType,
  deleteMode,
}: ToggleDeleteModeButtonProps) => {
  return (
    <View className="flex-grow">
      <Pressable
        className="flex-row justify-center rounded-full items-center active:opacity-40"
        style={{ gap: 8 }}
        onPress={() => {
          setDeleteMode((prev) => !prev);
          if (deleteMode) setMarkersToDelete([]);
        }}
      >
        <Feather
          name={"trash-2"}
          size={24}
          color={mapType !== "standard" ? "#fee2e2" : "#7f1d1d"}
        />
        <Text
          style={[
            medium,
            {
              color: mapType !== "standard" ? "#fee2e2" : "#7f1d1d",
              fontSize: 20,
            },
          ]}
        >
          Delete Options
        </Text>
      </Pressable>
    </View>
  );
};

export default ToggleDeleteModeButton;
