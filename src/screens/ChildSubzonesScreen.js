import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";
import { getSubzonesFromLocationGid } from "../services/locationService";
import { sendDriverActivityStatusUpdate } from "../services/updateService";
import { sendDriverVisibilitySourceUpdate } from "../services/driverVisibilityService";

export default function ChildSubzonesScreen({ route }) {
  const { locationGid, selectedSubzone } = route.params;
  const [subzones, setSubzones] = useState([]);
  const { authState } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSubzonesFromLocationGid(locationGid);
        setSubzones(data);
      } catch (err) {
        Alert.alert("Error", err.message || "Unable to load child subzones");
      }
    }
    load();
  }, [locationGid]);

  const handleSelect = async (subzone) => {
    try {
      await sendDriverVisibilitySourceUpdate({
        driverGid: authState.userId,
        subzone: subzone.xid,
      });
      Alert.alert("Visibility Source Updated", `Subzone set to ${subzone.xid}`);
      if (selectedSubzone === "SEARCH") {
        navigation.navigate("ShipmentSearch", { driverGid: authState.userId });
      } else {
        navigation.navigate("Shipments", { selectedSubzone });
      }
    } catch (err) {
      Alert.alert("Update Failed", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <View style={{ padding: 16, borderBottomWidth: 1 }}>
        <Text>{item.xid}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={subzones}
        keyExtractor={(item) => item.xid}
        renderItem={renderItem}
      />
    </View>
  );
}
