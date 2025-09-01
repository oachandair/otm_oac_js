import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { sendDriverRefnumUpdate } from "../services/driverSearchService";

export default function ShipmentSearchScreen() {
  const [trailerId, setTrailerId] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { driverGid } = route.params;

  const handleSubmit = async () => {
    if (!trailerId) {
      Alert.alert("Input Required", "Please enter a trailer ID.");
      return;
    }
    try {
      await sendDriverRefnumUpdate({ driverGid, trailerId });
      Alert.alert("Success", `Driver refnum updated with ${trailerId}`);
      navigation.navigate("Shipments");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to update driver refnum.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Enter Trailer ID to Search</Text>
      <TextInput
  style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, width: "100%", marginBottom: 16 }}
  placeholder="Trailer ID"
  value={trailerId}
  onChangeText={text => setTrailerId(text.replace(/\s+$/, ""))}
  autoCapitalize="characters"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
