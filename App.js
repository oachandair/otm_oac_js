import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import SubzonesScreen from "./src/screens/SubzonesScreen";
import ChildSubzonesScreen from "./src/screens/ChildSubzonesScreen";
import ShipmentDetailsScreen from "./src/screens/ShipmentDetailsScreen";
import ShipmentDetailsScreenSP from './src/screens/ShipmentDetailsScreenSP';
import ShipmentDetailsScreenDR from './src/screens/ShipmentDetailsScreenDR';
import ShipmentDetailsScreenVR from './src/screens/ShipmentDetailsScreenVR';
import ShipmentSearchScreen from "./src/screens/ShipmentSearchScreen";
import StandardShipmentsScreen from './src/screens/StandardShipmentsScreen';
import ManifestShipmentsScreen from './src/screens/ManifestShipmentsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Subzones" component={SubzonesScreen} />
          <Stack.Screen name="ChildSubzones" component={ChildSubzonesScreen} />
          <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />
          <Stack.Screen name="ShipmentDetailsScreenSP" component={ShipmentDetailsScreenSP} />
          <Stack.Screen name="ShipmentDetailsScreenDR" component={ShipmentDetailsScreenDR} />
          <Stack.Screen name="ShipmentDetailsScreenVR" component={ShipmentDetailsScreenVR} />
          <Stack.Screen name="ShipmentSearch" component={ShipmentSearchScreen} />
          <Stack.Screen name="StandardShipments" component={StandardShipmentsScreen} />
          <Stack.Screen name="ManifestShipments" component={ManifestShipmentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
