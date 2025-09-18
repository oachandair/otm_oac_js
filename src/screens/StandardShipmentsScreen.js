import { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, TextInput, Image, ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import StandardShipmentCard from '../components/StandardShipmentCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getVisibleShipments } from "../services/shpmentsService";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StandardShipmentsScreen() {
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
    let screenName = "ShipmentDetailsScreenVR"; // default for OTHER
    if (authState.roles.includes("SUPERVISOR")) {
      screenName = "ShipmentDetailsScreenSP";
    } else if (authState.roles.includes("DRIVER")) {
      screenName = "ShipmentDetailsScreenDR";
    }
    return (
      <TouchableOpacity onPress={() => navigation.navigate(screenName, { shipmentGid: item.shipmentGid })}>
        <StandardShipmentCard shipment={item} />
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
            LISTE DETAILS
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
