import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { sendDriverRefnumUpdate } from "../services/driverSearchService";

export default function ShipmentSearchScreen() {
  const [trailerId, setTrailerId] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
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
      navigation.navigate("StandardShipments", { selectedSubzone: "SINGLE" });
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to update driver refnum.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, paddingHorizontal: 8 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 8, backgroundColor: '#007AFF', borderRadius: 20, padding: 6 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', letterSpacing: 1, color: '#007AFF' }}>
          SEARCH
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
  <Text style={{ fontSize: 15, color: '#555', marginBottom: 24, textAlign: 'center' }}>Enter the trailer ID below to search for shipments.</Text>
        <View style={{ width: '100%', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F4F8', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 }}>
            <MaterialIcons name="inventory" size={24} color="#007AFF" style={{ marginLeft: 14, marginRight: 10 }} />
            <TextInput
              style={{
                flex: 1,
                borderWidth: 0,
                backgroundColor: 'transparent',
                paddingVertical: 14,
                paddingHorizontal: 0,
                fontSize: 18,
                color: '#222',
              }}
              placeholder="Trailer ID"
              placeholderTextColor="#888"
              value={trailerId}
              onChangeText={text => setTrailerId(text.replace(/\s+$/, ""))}
              autoCapitalize="characters"
              returnKeyType="search"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
            alignItems: 'center',
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
