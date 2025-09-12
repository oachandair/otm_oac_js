import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";
import { getSubzonesFromLocationGid } from "../services/locationService";
import { sendDriverActivityStatusUpdate } from "../services/updateService";
import { sendDriverVisibilitySourceUpdate } from "../services/driverVisibilityService";

export default function ChildSubzonesScreen({ route }) {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const { locationGid, selectedSubzone } = route.params;
  const [subzones, setSubzones] = useState([]);
  const { authState } = useAuth();

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
      } else if (selectedSubzone === "SINGLE") {
        navigation.navigate("StandardShipments", { selectedSubzone });
      } else {
        navigation.navigate("ManifestShipments", { selectedSubzone });
      }
    } catch (err) {
      Alert.alert("Update Failed", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        margin: 6,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      }}>
        <MaterialIcons name="play-circle-outline" size={20} color="#007AFF" style={{ marginRight: 8 }} />
  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.xid}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, paddingHorizontal: 8 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 8, backgroundColor: '#007AFF', borderRadius: 20, padding: 6 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', letterSpacing: 1, color: '#007AFF' }}>
          SOURCE
        </Text>
      </View>
      <FlatList
        data={subzones}
        keyExtractor={(item) => item.xid}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
