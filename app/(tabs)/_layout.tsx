import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  useFonts,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
} from "@expo-google-fonts/jost";
import { useRouter } from "expo-router";

const Layout = () => {
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="MeasureTab"
        options={{
          tabBarLabel: "Measure",
          title: "Quick Measure",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#6DAB64",
          },
          headerTitleStyle: {
            color: "#fff",
            fontFamily: "Jost_700Bold",
            fontSize: 18,
          },
          headerRight: () => (
            <Feather
              name="help-circle"
              size={24}
              color="#fff"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/HelpScreen")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
          tabBarInactiveTintColor: "#6DAB64",
          tabBarActiveTintColor: "#fff",
          tabBarStyle: {
            paddingTop: 4,
            backgroundColor: "#2B561F",
            borderTopColor: "transparent",
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
            fontFamily: "Jost_500Medium",
            fontSize: 13,
          },
        }}
      />

      <Tabs.Screen
        name="SavedTab"
        options={{
          tabBarLabel: "Saved",
          title: "Saved Measurements",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#6DAB64",
          },
          headerTitleStyle: {
            color: "#fff",
            fontFamily: "Jost_700Bold",
            fontSize: 18,
          },
          headerRight: () => (
            <Feather
              name="help-circle"
              size={24}
              color="#fff"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/HelpScreen")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Feather
              name="bookmark"
              size={size}
              color={color}
              className="mt-4"
            />
          ),
          tabBarInactiveTintColor: "#B1B1B1",
          tabBarActiveTintColor: "#2B561F",
          tabBarLabelStyle: {
            fontFamily: "Jost_500Medium",
            fontSize: 13,
          },
          tabBarStyle: {
            paddingTop: 4,
            backgroundColor: "#F7F7F7",
            borderTopColor: "transparent",
          },
        }}
      />
    </Tabs>
  );
};

export default Layout;
