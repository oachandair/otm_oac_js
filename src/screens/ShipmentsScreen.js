import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, TextInput, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { getVisibleShipments } from "../services/shpmentsService";
import { sendDriverActivityRefnumUpdate } from "../services/updateService";
import { useAuth } from "../context/AuthContext";

export default function ShipmentsScreen() {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { authState } = useAuth();
  // Get selectedSubzone from navigation params reliably
  const selectedSubzone = route.params?.selectedSubzone || "";

  useEffect(() => {
    async function load() {
      try {
        const data = await getVisibleShipments();
        setShipments(data);
      } catch (err) {
        Alert.alert("Error", err.message || "Unable to load shipments");
      }
    }
    load();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={async () => {
        // Find stop 1 refnumValue2
        const stop1 = item.stopOrderRefnums?.find(so => so.stopNumber === 1);
        if (stop1 && stop1.refnumValue2 === "OBHEADER") {
          try {
            // Extract value after last '--' in refnumValue1 and call it listidValue
            const refnumValue1 = item.refnumValue1;
            const listidValue = refnumValue1?.substring(refnumValue1.lastIndexOf('--') + 2) || '';
            await sendDriverActivityRefnumUpdate({
              driverGid: authState.userId,
              selectedSubzone,
              listidValue,
            });
            // Refresh shipment list after successful update
            const refreshedData = await getVisibleShipments();
            setShipments(refreshedData);
            Alert.alert("Driver Update", "Activity refnum updated.");
          } catch (err) {
            Alert.alert("Error", err.message || "Driver update failed");
          }
        } else {
          navigation.navigate("ShipmentDetails", { shipmentGid: item.shipmentGid });
        }
      }}
    >
      <View style={{ padding: 16, borderBottomWidth: 1 }}>
        <Text>Shipment GID: {item.shipmentGid}</Text>
        <Text>{item.refnumLabel1}: {item.refnumValue1}</Text>
        <Text>{item.refnumLabel2}: {item.refnumValue2}</Text>
        {/* Show shipment-level refnumValue2 */}
        <Text>Shipment refnumValue2: {item.refnumValue2}</Text>
        {/* Show stop order-level refnumValue2s with stop number */}
        {item.stopOrderRefnums && item.stopOrderRefnums.map((so, idx) => (
          <Text key={idx}>Stop {so.stopNumber} refnumValue2: {so.refnumValue2}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 16 }}>Visible Shipments</Text>
      <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
        <TextInput
          placeholder="Filter..."
          value={search}
          onChangeText={setSearch}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 }}
        />
      </View>
      {shipments.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../assets/not-found.png')}
            style={{ width: 180, height: 180, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, color: '#888' }}>No shipments found</Text>
        </View>
      ) : (
        <FlatList
          data={shipments.filter(item => {
            if (!search) return true;
            const searchLower = search.toLowerCase();
            return (
              item.shipmentGid?.toLowerCase().includes(searchLower) ||
              item.refnumValue1?.toLowerCase().includes(searchLower) ||
              item.refnumValue2?.toLowerCase().includes(searchLower) ||
              item.refnumLabel1?.toLowerCase().includes(searchLower) ||
              item.refnumLabel2?.toLowerCase().includes(searchLower)
            );
          })}
          keyExtractor={(item) => item.shipmentGid}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
