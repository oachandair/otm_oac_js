import React, { useEffect, useState, useLayoutEffect } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, FlatList, Alert, TouchableOpacity, TextInput, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getVisibleShipments } from "../services/shpmentsService";
import { useAuth } from "../context/AuthContext";
import ManifestShipmentCard from '../components/ManifestShipmentCard';

export default function ManifestShipmentsScreen() {
  useEffect(() => {
    console.log('Screen mounted: ManifestShipmentsScreen');
  }, []);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { authState } = useAuth();
  const selectedSubzone = route.params?.selectedSubzone || "";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getVisibleShipments();
        setShipments(data);
      } catch (err) {
        Alert.alert("Error", err.message || "Unable to load shipments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const renderItem = ({ item }) => {
    const stop1 = item.stopOrderRefnums?.find(so => so.stopNumber === 1);
    // Only show OBHEADER UI
    if (!(stop1 && stop1.refnumValue2 === "OBHEADER")) return null;
    return (
      <TouchableOpacity
        onPress={async () => {
          try {
            // Send driver activity update
            const refnumValue1 = item.refnumValue1;
            const listidValue = refnumValue1?.substring(refnumValue1.lastIndexOf('--') + 2) || '';
            await import('../services/updateService').then(({ sendDriverActivityRefnumUpdate }) =>
              sendDriverActivityRefnumUpdate({
                driverGid: authState.userId,
                selectedSubzone,
                listidValue,
              })
            );
            Alert.alert("Driver Update", "Activity refnum updated.");
            navigation.navigate("StandardShipments", { selectedSubzone: "SINGLE" });
          } catch (err) {
            Alert.alert("Error", err.message || "Driver update failed");
          }
        }}
      >
        <ManifestShipmentCard shipment={item} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20, paddingHorizontal: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 8, backgroundColor: '#007AFF', borderRadius: 20, padding: 6 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center', letterSpacing: 1, color: '#007AFF' }}>
            MANIFESTS
          </Text>
        </View>
      </SafeAreaView>
      <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
        <TextInput
          placeholder="Filter..."
          value={search}
          onChangeText={setSearch}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 }}
        />
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#888' }}>Loading shipments...</Text>
        </View>
      ) : shipments.length === 0 ? (
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
