import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";
import { getSubzonesFromProcesses } from "../services/locationService";

export default function SubzonesScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [subzones, setSubzones] = useState([]);
  const { authState } = useAuth();

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

  const handleSelect = (subzone) => {
    if (subzone.xid === "SINGLE") {
      navigation.navigate("StandardShipments", { selectedSubzone: subzone.xid });
    } else {
      navigation.navigate("ChildSubzones", { locationGid: subzone.gid, selectedSubzone: subzone.xid });
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
        <MaterialIcons name="account-balance" size={20} color="#007AFF" style={{ marginRight: 8 }} />
  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.xid}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, paddingHorizontal: 8 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 8, backgroundColor: '#007AFF', borderRadius: 20, padding: 6 }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', letterSpacing: 1, color: '#007AFF' }}>
          TMPA PROCESSES
        </Text>
      </View>
      <FlatList
        data={subzones}
        keyExtractor={(item) => item.xid}
        renderItem={renderItem}
      />
    </View>
  );
}
