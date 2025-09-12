import { useLayoutEffect } from "react";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, TextInput, Image, ActivityIndicator, SafeAreaView } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { getVisibleShipments } from "../services/shpmentsService";
import { sendDriverActivityRefnumUpdate } from "../services/updateService";
import { useAuth } from "../context/AuthContext";

export default function ShipmentsScreen() {
  useEffect(() => {
    console.log('Screen mounted: ShipmentsScreen');
  }, []);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  // ...existing code...
  const route = useRoute();
  const { authState } = useAuth();
  // Get selectedSubzone from navigation params reliably
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
    let customFields = null;
    if (stop1 && stop1.refnumValue2 === "OBHEADER" && item.refnumLabel1 === "TMSA.MOBILE_VIEW1") {
      // ...existing OBHEADER UI logic...
      const parts = (item.refnumValue1 || '').split('--');
      const process = parts[0] || '';
      const vesselName = parts[1] || '';
      let manifestId = parts[2] || '';
      if (manifestId.startsWith('TMSA.')) manifestId = manifestId.replace('TMSA.', '');
      customFields = (
        <View style={{ marginTop: 8 }}>
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
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={async () => {
          // ...existing code...
          if (stop1 && stop1.refnumValue2 === "OBHEADER") {
            try {
              const refnumValue1 = item.refnumValue1;
              const listidValue = refnumValue1?.substring(refnumValue1.lastIndexOf('--') + 2) || '';
              await sendDriverActivityRefnumUpdate({
                driverGid: authState.userId,
                selectedSubzone,
                listidValue,
              });
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
        <View style={{
          margin: 12,
          padding: 16,
          backgroundColor: '#fff',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          {/* Shipment GID and icon removed */}
          {/* Custom OBHEADER fields */}
          {customFields ? (
            customFields
          ) : (
            <>
              {/* Dynamically show all available fields except stopOrderRefnums for non-OBHEADER */}
              {/* refnumLabel1 and refnumLabel2 removed */}
              {/* refnumValue1: icons for container, tractor, flat bed */}
              {item.refnumValue1 ? (() => {
                const parts = item.refnumValue1.split('--');
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
              {item.refnumValue2 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <MaterialIcons name="person" size={22} color="#007AFF" style={{ marginRight: 8 }} />
                  <Text style={{ fontWeight: 'normal' }}>{item.refnumValue2}</Text>
                </View>
              ) : null}
            </>
          )}
          {/* Shipment-level refnumValue2 parsed as ETA and stats for OBHEADER only */}
          {stop1 && stop1.refnumValue2 === "OBHEADER" && item.refnumValue2 ? (() => {
            const refnumParts = item.refnumValue2.split('--');
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
          {/* Stops section removed; stopOrderRefnums used only for logic/conditions */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, marginTop: 40 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 12 }}
          >
            <MaterialIcons name="arrow-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', flex: 1, letterSpacing: 1, color: '#007AFF' }}>
            {(() => {
              // Find stop 1 for the first shipment (if any)
              const firstShipment = shipments[0];
              const stop1 = firstShipment?.stopOrderRefnums?.find(so => so.stopNumber === 1);
              if (stop1 && stop1.refnumValue2 === "OBHEADER") {
                return 'MANIFESTS';
              }
              return 'MANIFEST DETAILS';
            })()}
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
