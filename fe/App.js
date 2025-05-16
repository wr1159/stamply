import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import Home from "./components/Home";
import Social from "./components/Social";
import ProfileSettings from "./components/ProfileSettings";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E8D5C4",
            borderTopWidth: 1,
            paddingBottom: 5,
            paddingTop: 5,
            height: 80,
          },
          tabBarActiveTintColor: "#8B4513",
          tabBarInactiveTintColor: "#D4B5A0",
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "System",
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Scan"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>📱</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Social"
          component={Social}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>👥</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={ProfileSettings}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
