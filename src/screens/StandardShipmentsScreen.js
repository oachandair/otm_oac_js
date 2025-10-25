import { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, TextInput, Image, ActivityIndicator, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; // For user-check icon
import StandardShipmentCard from '../components/StandardShipmentCard';
import StandardShipmentCardSP from '../components/StandardShipmentCardSP'; // new card for supervisor
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getVisibleShipments } from "../services/shipmentListService";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";

export default function StandardShipmentsScreen() {
  const { authState } = useAuth();

  useEffect(() => {
    console.log("[DEBUG] User roles:", authState.roles);
  }, [authState.roles]);

  useEffect(() => {
    console.log('Screen mounted: StandardShipmentsScreen');
  }, []);
  
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const route = useRoute();
  const selectedSubzone = route.params?.selectedSubzone || "";

  const statusOptions = [
    { key: null, label: "All", color: "#E0E0E0", icon: "filter-list", iconLib: MaterialIcons },
    { key: "AT", label: "Attached", color: "#FFC107", icon: "link", iconLib: MaterialIcons },
    { key: "AC", label: "Accepted", color: "#2196F3", icon: "user-check", iconLib: Feather },
    { key: "DT", label: "Detached", color: "#43A047", icon: "emoji-events", iconLib: MaterialIcons },
    { key: "TD", label: "Temp Detached", color: "#FF9800", icon: "link-off", iconLib: MaterialIcons },
    { key: "XX", label: "Not Attached", color: "#B0BEC5", icon: "block", iconLib: MaterialIcons },
    { key: "RJ", label: "Rejected", color: "#F44336", icon: "cancel", iconLib: MaterialIcons },
  ];

  // Load shipments function
  const loadShipments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVisibleShipments();
      setShipments(data);
    } catch (err) {
      Alert.alert("Error", err.message || "Unable to load shipments");
    } finally {
      setLoading(false);
    }
  }, []);

  // Always fetch fresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadShipments();
    }, [loadShipments])
  );

  // Reload function for manual refresh button
  const reloadShipments = loadShipments;

  const renderItem = ({ item }) => {
    let screenName = "ShipmentDetailsScreenVR"; // default for OTHER
    let CardComponent = StandardShipmentCard;
    if (authState.roles.includes("SUPERVISOR_ROLE")) {
      screenName = "ShipmentDetailsScreenSP";
      CardComponent = StandardShipmentCardSP;
    } else if (authState.roles.includes("DRIVER_ROLE")) {
      screenName = "ShipmentDetailsScreenDR";
    }
    return (
      <TouchableOpacity onPress={() => navigation.navigate(screenName, { shipmentGid: item.shipmentGid })}>
        <CardComponent shipment={item} />
      </TouchableOpacity>
    );
  };

  const filteredShipments = shipments.filter(item => {
    if (!search && !selectedStatus) return true;
    const searchLower = search.toLowerCase();
    const statusPrefix = item.refnumValue2?.substring(0, 2);
    const matchesStatus = selectedStatus ? statusPrefix === selectedStatus : true;
    const matchesSearch = !search || (
      item.shipmentGid?.toLowerCase().includes(searchLower) ||
      item.refnumValue1?.toLowerCase().includes(searchLower) ||
      item.refnumValue2?.toLowerCase().includes(searchLower)
    );
    return matchesStatus && matchesSearch;
  });

  // Sort filtered shipments so AC- (Accepted) appear first
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    const aIsAccepted = a.refnumValue2?.startsWith("AC") ? 1 : 0;
    const bIsAccepted = b.refnumValue2?.startsWith("AC") ? 1 : 0;
    return bIsAccepted - aIsAccepted; // AC first
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
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
            disabled={loading}
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
              LISTE DETAILS
            </Text>
          </View>
          <TouchableOpacity
            onPress={reloadShipments}
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
            <MaterialIcons name="refresh" size={24} color="#fff" />
            {loading && (
              <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
        {/* Compact filter row */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          {/* Status filter dropdown */}
          <TouchableOpacity
            onPress={() => setShowStatusPicker(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: selectedStatus ? statusOptions.find(opt => opt.key === selectedStatus)?.color : '#F5F5F5',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: selectedStatus ? statusOptions.find(opt => opt.key === selectedStatus)?.color : '#ccc',
              minWidth: 120,
            }}
          >
            <MaterialIcons 
              name="filter-list" 
              size={18} 
              color={selectedStatus ? '#fff' : '#666'} 
              style={{ marginRight: 6 }}
            />
            <Text style={{ 
              color: selectedStatus ? '#fff' : '#666', 
              fontSize: 14, 
              fontWeight: '600',
              flex: 1,
            }}>
              {selectedStatus ? statusOptions.find(opt => opt.key === selectedStatus)?.label : 'All Status'}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={18} color={selectedStatus ? '#fff' : '#666'} />
          </TouchableOpacity>
          
          {/* ID search input */}
          <TextInput
            placeholder="Search by ID..."
            value={search}
            onChangeText={setSearch}
            style={{ 
              flex: 1,
              borderWidth: 1, 
              borderColor: '#ccc', 
              borderRadius: 8, 
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
            }}
          />
        </View>
        
        {/* Status picker modal */}
        <Modal
          visible={showStatusPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStatusPicker(false)}
        >
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
            onPress={() => setShowStatusPicker(false)}
          >
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              paddingVertical: 8,
              marginHorizontal: 20,
              minWidth: 280,
              maxHeight: 400,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
                color: '#333',
              }}>
                Filter by Status
              </Text>
              {statusOptions.map(opt => {
                const IconComponent = opt.iconLib;
                const isSelected = selectedStatus === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key || "all"}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      backgroundColor: isSelected ? '#F0F8FF' : 'transparent',
                      borderLeftWidth: isSelected ? 4 : 0,
                      borderLeftColor: opt.color,
                    }}
                    onPress={() => {
                      setSelectedStatus(opt.key);
                      setShowStatusPicker(false);
                    }}
                  >
                    <IconComponent
                      name={opt.icon}
                      size={20}
                      color={opt.color}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={{
                      fontSize: 14,
                      color: '#333',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      flex: 1,
                    }}>
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check" size={20} color={opt.color} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#888' }}>Loading shipments...</Text>
        </View>
      ) : sortedShipments.length === 0 ? (
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
          data={sortedShipments}
          keyExtractor={(item) => item.shipmentGid}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
