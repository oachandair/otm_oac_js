// Backup of ShipmentsScreen.js before conditional navigation logic
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { getVisibleShipments } from "../services/shpmentsService";

export default function ShipmentsScreen() {
  const [shipments, setShipments] = useState([]);
  const navigation = useNavigation();

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
    <TouchableOpacity onPress={() => navigation.navigate("ShipmentDetails", { shipmentGid: item.shipmentGid })}>
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
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.shipmentGid}
        renderItem={renderItem}
      />
    </View>
  );
}
