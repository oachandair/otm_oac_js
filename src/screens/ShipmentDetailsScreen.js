import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, ScrollView, Alert, Button, TouchableOpacity, TextInput } from "react-native";
import { sendShipmentEventGPS } from "../services/shipmentEventService";
import ExecutionShipmentCard from '../components/ExecutionShipmentCard';
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import MapView, { Marker, Polyline } from "react-native-maps";
import { getShipmentDetails } from "../services/shpmentsService";

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ShipmentDetailsScreen({ route }) {
  useEffect(() => {
    console.log('Screen mounted: ShipmentDetailsScreen');
  }, []);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [remarkText, setRemarkText] = useState("");
  const location = useCurrentLocation();
  const { shipmentGid } = route.params;
  const [shipment, setShipment] = useState(null);

  // Helper to reload shipment details
  const reloadShipment = async () => {
    try {
      const data = await getShipmentDetails(shipmentGid);
      setShipment(data);
    } catch (err) {
      Alert.alert("Error", err.message || "Unable to load shipment details");
    }
  };

  useEffect(() => {
    reloadShipment();
  }, [shipmentGid]);

  if (!shipment) {
    return <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>;
  }

  // Extract latitude and longitude from shipmentRefnum array
  const latitude = shipment.shipmentRefnum?.find(
    ref => ref.shipmentRefnumBeanData?.shipmentRefnumQualGid === "TMSA.LATITUDE"
  )?.shipmentRefnumBeanData?.shipmentRefnumValue;

  const longitude = shipment.shipmentRefnum?.find(
    ref => ref.shipmentRefnumBeanData?.shipmentRefnumQualGid === "TMSA.LONGITUDE"
  )?.shipmentRefnumBeanData?.shipmentRefnumValue;

  // Convert to numbers for MapView
  const latNum = latitude ? parseFloat(latitude) : null;
  const lonNum = longitude ? parseFloat(longitude) : null;

  const handleSendEvent = async (quickCode) => {
    if (!location?.coords) {
      Alert.alert("Location not available", "Please enable location services and try again.");
      return;
    }
    const args = {
      shipmentGid: shipment.shipmentGid,
      location,
      quickCode,
      remarkText,
    };
    console.log("[DEBUG] Event Args:", args);
    try {
      const response = await sendShipmentEventGPS(args); // auth handled inside service
      Alert.alert("Event Sent", response);
      await reloadShipment();
    } catch (err) {
      Alert.alert("Send Failed", err.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Custom Title Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, paddingHorizontal: 8 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 8, backgroundColor: '#007AFF', borderRadius: 20, padding: 6 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', letterSpacing: 1, color: '#007AFF' }}>
          TMPA TRACTION
        </Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <ExecutionShipmentCard shipment={shipment} />
      {/* Modern Remark Input - single box with placeholder */}
      <View style={{ marginVertical: 12 }}>
        <TextInput
          value={remarkText}
          onChangeText={setRemarkText}
          placeholder="Remark..."
          style={{
            fontSize: 16,
            color: '#222',
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: '#F9F9F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 2,
            elevation: 1,
          }}
          multiline
          maxLength={120}
        />
      </View>
      {/* Send Event Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}>
        {/* CSAPK button on the left, yellow */}
        <View style={{ flex: 1, marginRight: 8 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#FFD600', paddingVertical: 12, borderRadius: 6, alignItems: 'center' }}
            onPress={() => handleSendEvent("CSAPK")}
          >
            <Text style={{ color: '#333', fontWeight: 'bold' }}>Send CSAPK</Text>
          </TouchableOpacity>
        </View>
        {/* CSDPK button on the right, green */}
        <View style={{ flex: 1, marginLeft: 8 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#43A047', paddingVertical: 12, borderRadius: 6, alignItems: 'center' }}
            onPress={() => handleSendEvent("CSDPK")}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send CSDPK</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Map Section */}
      {typeof latNum === 'number' && typeof lonNum === 'number' && (
        <View style={{ height: 250, marginVertical: 16, borderRadius: 12, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: latNum,
              longitude: lonNum,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Shipment marker */}
            <Marker
              coordinate={{ latitude: latNum, longitude: lonNum }}
              title="Shipment Location"
              pinColor="blue"
              description={`Lat: ${latNum}, Lon: ${lonNum}`}
            />
            {/* Device marker */}
            {location?.coords &&
              typeof location.coords.latitude === 'number' &&
              typeof location.coords.longitude === 'number' && (
                <Marker
                  coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                  title="Your Location"
                  pinColor="green"
                  description={`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`}
                />
            )}
            {/* Line between device and shipment */}
            {location?.coords &&
              typeof location.coords.latitude === 'number' &&
              typeof location.coords.longitude === 'number' && (
                <Polyline
                  coordinates={[
                    { latitude: location.coords.latitude, longitude: location.coords.longitude },
                    { latitude: latNum, longitude: lonNum }
                  ]}
                  strokeColor="#FF0000"
                  strokeWidth={2}
                />
            )}
          </MapView>
        </View>
      )}
      {/* Add more fields as needed */}
      </ScrollView>
    </View>
  );
}
