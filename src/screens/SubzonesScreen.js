import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getSubzonesFromProcesses } from "../services/locationService";
import { sendDriverActivityStatusUpdate } from "../services/updateService";

export default function SubzonesScreen() {
  const [subzones, setSubzones] = useState([]);
  const { authState } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSubzonesFromProcesses();
        setSubzones(data);
      } catch (err) {
        Alert.alert("Error", "Unable to load subzones");
      }
    }
    load();
  }, []);

  const handleSelect = async (subzone) => {
    try {
      await sendDriverActivityStatusUpdate({
        driverGid: authState.userId,
        subzone: subzone.xid,
      });
      Alert.alert("Status Sent", `Activity set to ${subzone.xid}`);
      if (subzone.xid === "SINGLE") {
        navigation.navigate("Shipments", { selectedSubzone: subzone.xid });
      } else {
        navigation.navigate("ChildSubzones", { locationGid: subzone.gid, selectedSubzone: subzone.xid });
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
