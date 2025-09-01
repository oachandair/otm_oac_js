import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import SubzonesScreen from "./src/screens/SubzonesScreen";
import ChildSubzonesScreen from "./src/screens/ChildSubzonesScreen";
import ShipmentsScreen from "./src/screens/ShipmentsScreen";
import ShipmentDetailsScreen from "./src/screens/ShipmentDetailsScreen";
import ShipmentSearchScreen from "./src/screens/ShipmentSearchScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Subzones" component={SubzonesScreen} />
          <Stack.Screen name="ChildSubzones" component={ChildSubzonesScreen} />
          <Stack.Screen name="Shipments" component={ShipmentsScreen} />
          <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />
          <Stack.Screen name="ShipmentSearch" component={ShipmentSearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
