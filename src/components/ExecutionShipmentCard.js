import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExecutionShipmentCard({ shipment }) {
  if (!shipment) return null;
    return (
      <View style={styles.card}>
        <View style={styles.floatingIndicator} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialIcons name="info" size={18} color="#007AFF" style={{ marginRight: 4 }} />
          <Text style={styles.title}>Shipment GID:</Text>
          <Text style={styles.value}>{shipment.shipmentGid}</Text>
        </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MaterialIcons name="location-on" size={18} color="#007AFF" style={{ marginRight: 4 }} />
        <Text style={styles.label}>Dest:</Text>
        <Text style={styles.value}>{shipment.destLocationGid}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
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
    backgroundColor: '#fff', // Default color is now white
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#007AFF', // Blue border for visibility
    shadowColor: '#007AFF', // Subtle blue shadow
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
