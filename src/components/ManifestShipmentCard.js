import React from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ManifestShipmentCard({ shipment }) {
  const stop1 = shipment.stopOrderRefnums?.find(so => so.stopNumber === 1);
  if (!(stop1 && stop1.refnumValue2 === "OBHEADER" && shipment.refnumLabel1 === "TMSA.MOBILE_VIEW1")) return null;
  const parts = (shipment.refnumValue1 || '').split('--');
  const process = parts[0] || '';
  const vesselName = parts[1] || '';
  let manifestId = parts[2] || '';
  if (manifestId.startsWith('TMSA.')) manifestId = manifestId.replace('TMSA.', '');
  return (
    <View style={{ margin: 12, padding: 16, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MaterialIcons name="settings" size={22} color="#2196F3" style={{ marginRight: 8 }} />
        <Text style={{ fontWeight: 'normal' }}>{process}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MaterialIcons name="directions-boat" size={22} color="#009688" style={{ marginRight: 8 }} />
        <Text style={{ fontWeight: 'normal' }}>{vesselName}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MaterialIcons name="description" size={22} color="#FF5722" style={{ marginRight: 8 }} />
        <Text style={{ fontWeight: 'normal' }}>{manifestId}</Text>
      </View>
      {/* ETA and stats */}
      {stop1 && shipment.refnumValue2 ? (() => {
        const refnumParts = shipment.refnumValue2.split('--');
        const eta = refnumParts[0] || '';
        const total = refnumParts[1] || '';
        return (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialIcons name="access-time" size={20} color="#4CAF50" style={{ marginRight: 8 }} />
              <Text style={{ fontWeight: 'bold' }}>{eta}</Text>
            </View>
            {total ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <MaterialIcons name="bar-chart" size={20} color="#FF9800" style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: 'bold' }}>{total}</Text>
              </View>
            ) : null}
          </>
        );
      })() : null}
    </View>
  );
}
