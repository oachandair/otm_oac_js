import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Button } from "react-native";
import { sendShipmentEvent } from "../services/shipmentEventService";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import MapView, { Marker, Polyline } from "react-native-maps";
import { getShipmentDetails } from "../services/shpmentsService";

export default function ShipmentDetailsScreen({ route }) {
  const location = useCurrentLocation();
  const { shipmentGid } = route.params;
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getShipmentDetails(shipmentGid);
        setShipment(data);
      } catch (err) {
        Alert.alert("Error", err.message || "Unable to load shipment details");
      }
    }
    load();
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

  return (
  <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 16 }}>Shipment Details</Text>
      <Text>Shipment GID: {shipment.shipmentGid}</Text>
      <Text>Shipment XID: {shipment.shipmentXid}</Text>
      <Text>Source Location: {shipment.sourceLocationGid}</Text>
      <Text>Destination Location: {shipment.destLocationGid}</Text>
      <Text>Start Time: {shipment.startTime?.date}</Text>
      <Text>End Time: {shipment.endTime?.date}</Text>
      <Text>Total Weight: {shipment.totalWeight?.value} {shipment.totalWeight?.uomCode}</Text>
      <Text>Total Volume: {shipment.totalVolume?.value} {shipment.totalVolume?.uomCode}</Text>
      <Text>Mobile View 1: {shipment.mobileView1}</Text>
      <Text>Mobile View 2: {shipment.mobileView2}</Text>
      <Text>Latitude: {latitude || "N/A"}</Text>
      <Text>Longitude: {longitude || "N/A"}</Text>
      {/* Send Event Button */}
      <View style={{ marginVertical: 12 }}>
        <Button
          title="Send Shipment Event"
          onPress={async () => {
            if (!location?.coords) {
              Alert.alert("Location not available", "Please enable location services and try again.");
              return;
            }
            const quickCode = "CSDPK";
            const eventDateMillis = Date.now();
            const eventPayload = {
              stopNumber: -1,
              eventDateTz: "Africa/Casablanca",
              shipmentGid: shipment.shipmentGid,
              eventDateOffset: 0,
              quickCode,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              eventDateMillis,
              remarkText: "AAAA-XX-CCC",
            };
            console.log("[DEBUG] Event Payload:", eventPayload);
            try {
              const response = await sendShipmentEvent(eventPayload);
              Alert.alert("Event Sent", response);
            } catch (err) {
              Alert.alert("Send Failed", err.message);
            }
          }}
        />
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
  );
}
