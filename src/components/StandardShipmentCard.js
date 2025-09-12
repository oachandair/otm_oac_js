import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getIndicatorColor } from '../utils/indicatorColor';

export default function StandardShipmentCard({ shipment }) {
  const stop1 = shipment.stopOrderRefnums?.find(so => so.stopNumber === 1);
  if (stop1 && stop1.refnumValue2 === "OBHEADER") return null;
  const indicatorColor = getIndicatorColor(shipment.refnumValue2);

  return (
    <View style={styles.card}>
      <View style={[styles.floatingIndicator, { backgroundColor: indicatorColor }]} />
      {/* refnumValue1: icons for container, tractor, flat bed */}
      {shipment.refnumValue1 ? (() => {
        const parts = shipment.refnumValue1.split('--');
        return (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="truck-trailer" size={22} color="#2196F3" style={{ marginRight: 8 }} />
              <Text style={{ fontWeight: 'normal' }}>{parts[0]}</Text>
            </View>
            {parts[1] ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MaterialCommunityIcons name="truck" size={22} color="#FF9800" style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: 'normal' }}>{parts[1]}</Text>
              </View>
            ) : null}
            {parts[2] ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MaterialIcons name="view-agenda" size={22} color="#4CAF50" style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: 'normal' }}>{parts[2]}</Text>
              </View>
            ) : null}
          </>
        );
      })() : null}
      {/* refnumValue2: icon for driver assignment */}
      {shipment.refnumValue2 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialIcons name="person" size={22} color="#007AFF" style={{ marginRight: 8 }} />
          <Text style={{ fontWeight: 'normal' }}>{shipment.refnumValue2}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  floatingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff', // Default color is white
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#007AFF', // Blue border for visibility
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
});
