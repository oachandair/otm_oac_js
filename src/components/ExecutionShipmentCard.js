import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from "react-native-maps";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

export default function ExecutionShipmentCard({ shipment }) {
  if (!shipment) return null;

  // Extract latitude/longitude from refnums
  const latitude = shipment.shipmentRefnum?.find(
    ref => ref.shipmentRefnumBeanData?.shipmentRefnumQualGid === "TMSA.LATITUDE"
  )?.shipmentRefnumBeanData?.shipmentRefnumValue;

  const longitude = shipment.shipmentRefnum?.find(
    ref => ref.shipmentRefnumBeanData?.shipmentRefnumQualGid === "TMSA.LONGITUDE"
  )?.shipmentRefnumBeanData?.shipmentRefnumValue;

  const latNum = latitude ? parseFloat(latitude) : null;
  const lonNum = longitude ? parseFloat(longitude) : null;

  const location = useCurrentLocation();
  const mapRef = useRef(null);

  // Fit both points in view when both are available
  useEffect(() => {
    if (
      mapRef.current &&
      latNum !== null && lonNum !== null &&
      location?.coords?.latitude !== undefined &&
      location?.coords?.longitude !== undefined
    ) {
      mapRef.current.fitToCoordinates([
        { latitude: latNum, longitude: lonNum },
        { latitude: location.coords.latitude, longitude: location.coords.longitude }
      ], {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  }, [latNum, lonNum, location]);

  return (
    <View style={styles.card}>
      <View style={styles.floatingIndicator} />
      {/* Removed Shipment GID and Dest display */}
      
      {/* Show extracted Status Attach and Status Control */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#007AFF', fontWeight: 'bold', marginBottom: 2 }}>Attach Status:</Text>
          <Text style={{ fontSize: 13, color: '#222', marginBottom: 2 }}>{shipment.statusAttach || "N/A"}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#007AFF', fontWeight: 'bold', marginBottom: 2 }}>Control Status:</Text>
          <Text style={{ fontSize: 13, color: '#222', marginBottom: 2 }}>{shipment.statusControl || "N/A"}</Text>
        </View>
      </View>

      {/* Mobile Views styled similar to StandardShipmentCard */}
      <View style={{ marginTop: 18 }}>
        {shipment.mobileView1 ? (
          <View style={styles.mobileViewBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="truck-trailer" size={18} color="#007AFF" style={{ marginRight: 6 }} />
              <Text style={styles.mobileViewText}>{shipment.mobileView1}</Text>
            </View>
          </View>
        ) : null}
        {shipment.mobileView2 ? (
          <View style={styles.mobileViewBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="account" size={18} color="#007AFF" style={{ marginRight: 6 }} />
              <Text style={styles.mobileViewText}>{shipment.mobileView2}</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* Map inside card */}
      {latNum !== null && lonNum !== null && (
        <View style={{
          flex: 1, // Fill card space
          borderRadius: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: "#E0E0E0",
          backgroundColor: "#fff",
          marginVertical: 8,
        }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1, width: '100%' }} // Ensure map fills container
            initialRegion={{
              latitude: latNum,
              longitude: lonNum,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsCompass={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            <Marker
              coordinate={{ latitude: latNum, longitude: lonNum }}
              title="Shipment Location"
              pinColor="blue"
              description={`Lat: ${latNum}, Lon: ${lonNum}`}
            />
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
            {location?.coords &&
              typeof location.coords.latitude === 'number' &&
              typeof location.coords.longitude === 'number' && (
                <Polyline
                  coordinates={[
                    { latitude: location.coords.latitude, longitude: location.coords.longitude },
                    { latitude: latNum, longitude: lonNum }
                  ]}
                  strokeColor="#007AFF"
                  strokeWidth={3}
                />
            )}
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 0, // Remove bottom margin
    flex: 1,         // Make card fill available space
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  floatingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  label: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 13,
    color: '#222',
    marginBottom: 2,
    marginLeft: 4,
  },
  mobileViewBox: {
    backgroundColor: '#F0F4F8',
    borderRadius: 6,
    padding: 6,
    marginBottom: 6,
    marginHorizontal: 1,
  },
  mobileViewText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});
