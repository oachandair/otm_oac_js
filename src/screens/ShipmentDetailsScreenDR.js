import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ExecutionShipmentCard from "../components/ExecutionShipmentCard";
import { getShipmentDetails } from "../services/shipmentIdService";
import { sendShipmentEvent } from "../services/shipmentEventService";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ShipmentDetailsScreenDR({ route }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalRemark, setModalRemark] = useState("");
  const location = useCurrentLocation();
  const shipmentGid = route?.params?.shipmentGid;

  const reloadShipment = async () => {
    setLoading(true);
    try {
      const data = await getShipmentDetails(shipmentGid);
      setShipment(data);
      setLastUpdated(new Date());
    } catch (err) {
      Alert.alert("Reload Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadShipment();
  }, [shipmentGid]);

  if (!shipment) {
    return <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>;
  }

  const attachStatus = shipment.statusAttach;
  let transportIcon = "truck";
  let transportColor = "#B0BEC5";

  // Set transportColor to match button colors for ATTACHED and DETACHED
  switch (attachStatus) {
    case "ATTACHED":
    case "ATTACHED_CONFIRMED":
      transportIcon = "truck-loading";
      transportColor = "#FFC107"; // Darker yellow for better contrast
      break;
    case "DETACHED":
      transportIcon = "truck-moving";
      transportColor = "#43A047"; // Green
      break;
    case "DETACHED_TEMPORARY":
      transportIcon = "truck";
      transportColor = "#FFC107"; // Match darker yellow
      break;
    case "NOTAPPLICABLE":
      transportIcon = "ban";
      transportColor = "#888";
      break;
    case "NOTATTACHED":
      transportIcon = "truck";
      transportColor = "#B0BEC5";
      break;
    default:
      transportIcon = "truck";
      transportColor = "#B0BEC5";
  }

  const openModal = (type) => {
    setModalType(type);
    setModalRemark("");
    setModalVisible(true);
  };

  const handleSendGPSEvent = async (quickCode, remarkText) => {
    if (!location?.coords) {
      Alert.alert("Location not available", "Please enable location services and try again.");
      return;
    }
    const args = {
      shipmentGid: shipment.shipmentGid,
      location,
      quickCode,
      remarkText,
    };
    try {
      const response = await sendShipmentEvent({ type: "GPS", ...args });
      Alert.alert("Event Sent", response);
      await new Promise(res => setTimeout(res, 2000)); // Add 2s delay
      await reloadShipment();
    } catch (err) {
      Alert.alert("Send Failed", err.message);
    }
  };

  const handleSendINFEvent = async (quickCode, remarkText) => {
    const args = {
      shipmentGid: shipment.shipmentGid,
      quickCode,
      remarkText,
    };
    try {
      const response = await sendShipmentEvent({ type: "INF", ...args });
      Alert.alert("Event Sent", response);
      await new Promise(res => setTimeout(res, 2000)); // Add 2s delay
      await reloadShipment();
    } catch (err) {
      Alert.alert("Send Failed", err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {/* Global loading overlay */}
        {loading && (
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 12, color: "#007AFF", fontWeight: "bold", fontSize: 16 }}>Refreshing...</Text>
          </View>
        )}

        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 40,
          marginBottom: 20,
          paddingHorizontal: 8,
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: '#007AFF', borderRadius: 20, padding: 6 }}
            disabled={loading} // Disable during loading
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 1,
              color: '#007AFF'
            }}>
              TMPA TRACTION
            </Text>
          </View>
          <TouchableOpacity
            onPress={reloadShipment}
            disabled={loading}
            style={{
              backgroundColor: '#007AFF',
              borderRadius: 20,
              padding: 6,
              borderWidth: 1,
              borderColor: "#007AFF",
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              opacity: loading ? 0.6 : 1,
              marginLeft: 8,
            }}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
            {loading && (
              <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {/* Shipment info row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: transportColor,
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 16,
              marginBottom: 12,
              marginHorizontal: 0,
            }}
          >
            <FontAwesome5
              name={transportIcon}
              size={22}
              color="#fff"
              style={{ marginRight: 12 }}
              solid
            />
            <MaterialCommunityIcons name="identifier" size={22} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, marginRight: 12 }}>
              {shipment.shipmentGid}
            </Text>
            <MaterialIcons name="location-on" size={22} color="#fff" style={{ marginRight: 4 }} />
            <Text style={{ color: "#fff", fontSize: 15 }}>
              {shipment.destLocationGid}
            </Text>
          </View>

          {/* Last updated timestamp */}
          {lastUpdated && (
            <Text style={{ color: "#888", fontSize: 12, textAlign: "center", marginBottom: 8 }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}

          {/* Event buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#FFC107',
                width: 72,
                height: 72,
                borderRadius: 36,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 12,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                opacity: loading ? 0.6 : 1,
              }}
              onPress={() => openModal("CSATT")}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>ATTACH</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#43A047',
                width: 72,
                height: 72,
                borderRadius: 36,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 12,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                opacity: loading ? 0.6 : 1,
              }}
              onPress={() => openModal("CSDET")}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>DETACH</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Modal */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)"
            }}>
              <View style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 20,
                width: "80%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12, color: modalType === "CSDET" ? "#43A047" : "#007AFF" }}>
                  Confirm {modalType} Event
                </Text>
                <Text style={{ marginBottom: 8 }}>Add a remark (optional):</Text>
                <TextInput
                  value={modalRemark}
                  onChangeText={setModalRemark}
                  placeholder="Remark..."
                  style={{
                    fontSize: 16,
                    color: "#222",
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: "#F9F9F9",
                    marginBottom: 16,
                  }}
                  multiline
                  maxLength={120}
                  editable={!loading}
                />
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ marginRight: 16 }}
                    disabled={loading}
                  >
                    <Text style={{ color: "#888", fontWeight: "bold", fontSize: 16 }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        if (modalType === "CSDET") {
                          await handleSendGPSEvent("CSDET", modalRemark);
                        } else if (modalType === "CSATT") {
                          await handleSendINFEvent("CSATT", modalRemark);
                        }
                      } catch (err) {
                        Alert.alert("Send Failed", err.message);
                      } finally {
                        setModalVisible(false); // Always close modal
                      }
                    }}
                    style={{
                      backgroundColor: modalType === "CSDET" ? "#43A047" : "#FFC107",
                      borderRadius: 6,
                      paddingHorizontal: 18,
                      paddingVertical: 8,
                      opacity: loading ? 0.6 : 1,
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>OK</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Card fills remaining space */}
          <View style={{ flex: 1 }}>
            <ExecutionShipmentCard shipment={shipment} loading={loading} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}