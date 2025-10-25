import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { sendShipmentEvent } from "../services/shipmentEventService";
import { useNavigation } from "@react-navigation/native";

export default function StandardShipmentCardSP({ shipment }) {
  const [loadingEvent, setLoadingEvent] = useState(null);
  const [localButtonStates, setLocalButtonStates] = useState({
    acceptDisabled: false,
    denyDisabled: false
  });
  const navigation = useNavigation();

  if (!shipment) return null;

  // Status logic
  const refnum2 = shipment.refnumValue2 || "";
  let accentColor = "#B0BEC5";
  let statusText = "Unknown";
  let statusTextColor = "#555";
  let statusBgColor = "#E0E0E0";
  let statusIcon = "help-outline";
  let statusIconLib = MaterialIcons;

  if (refnum2.startsWith("AT")) {
    accentColor = "#FFC107";
    statusText = "Attached";
    statusTextColor = "#fff";
    statusBgColor = "#FFC107";
    statusIcon = "link";
    statusIconLib = MaterialIcons;
  } else if (refnum2.startsWith("AC")) {
    accentColor = "#2196F3";
    statusText = "Accepted";
    statusTextColor = "#fff";
    statusBgColor = "#2196F3";
    statusIcon = "user-check";
    statusIconLib = Feather;
  } else if (refnum2.startsWith("DT")) {
    accentColor = "#43A047";
    statusText = "Detached";
    statusTextColor = "#fff";
    statusBgColor = "#43A047";
    statusIcon = "emoji-events";
    statusIconLib = MaterialIcons;
  } else if (refnum2.startsWith("TD")) {
    accentColor = "#FF9800";
    statusText = "Temp Detached";
    statusTextColor = "#fff";
    statusBgColor = "#FF9800";
    statusIcon = "link-off";
    statusIconLib = MaterialIcons;
  } else if (refnum2.startsWith("XX")) {
    accentColor = "#B0BEC5";
    statusText = "Not Attached";
    statusTextColor = "#fff";
    statusBgColor = "#B0BEC5";
    statusIcon = "block";
    statusIconLib = MaterialIcons;
  } else if (refnum2.startsWith("RJ")) {
    accentColor = "#F44336";
    statusText = "Rejected";
    statusTextColor = "#fff";
    statusBgColor = "#F44336";
    statusIcon = "cancel";
    statusIconLib = MaterialIcons;
  }

  // Event handler
  const handleEvent = async (quickCode) => {
    setLoadingEvent(quickCode);
    try {
      const args = {
        shipmentGid: shipment.shipmentGid,
        quickCode,
        remarkText: "",
      };
      const response = await sendShipmentEvent({ type: "INF", ...args });
      
      // Update local button states based on action taken
      if (quickCode === "CSAPR") {
        // After successful accept, disable accept button
        setLocalButtonStates(prev => ({ ...prev, acceptDisabled: true }));
      } else if (quickCode === "CSDEN") {
        // After successful deny, disable deny button
        setLocalButtonStates(prev => ({ ...prev, denyDisabled: true }));
      }
      
      Alert.alert("Event Sent", response);
    } catch (err) {
      Alert.alert("Send Failed", err.message || "Failed to send event");
      // On error, don't update button states - keep them as they were
    } finally {
      setLoadingEvent(null);
    }
  };

  // Determine initial button availability based on current status
  const statusPrefix = refnum2.substring(0, 2);
  const initialCanAccept = ["XX", "AT", "RJ"].includes(statusPrefix);
  const initialCanDeny = ["XX", "AT"].includes(statusPrefix);
  
  // Final button states: initial availability AND local state
  const canAccept = initialCanAccept && !localButtonStates.acceptDisabled;
  const canDeny = initialCanDeny && !localButtonStates.denyDisabled;

  // MobView Refnum 1 icons
  let refnum1Views = null;
  if (shipment.refnumValue1) {
    const parts = shipment.refnumValue1.split("--");
    refnum1Views = (
      <View style={styles.refnumRow}>
        <MaterialCommunityIcons name="truck-trailer" size={20} color="#2196F3" style={{ marginRight: 6 }} />
        <Text style={styles.refnumText}>{parts[0]}</Text>
        {parts[1] && (
          <>
            <MaterialCommunityIcons name="truck" size={20} color="#FF9800" style={{ marginLeft: 12, marginRight: 6 }} />
            <Text style={styles.refnumText}>{parts[1]}</Text>
          </>
        )}
        {parts[2] && (
          <>
            <MaterialIcons name="view-agenda" size={20} color="#4CAF50" style={{ marginLeft: 12, marginRight: 6 }} />
            <Text style={styles.refnumText}>{parts[2]}</Text>
          </>
        )}
      </View>
    );
  }

  // MobView Refnum 2 icon
  let refnum2View = null;
  if (shipment.refnumValue2) {
    refnum2View = (
      <View style={styles.refnumRow}>
        <MaterialIcons name="person" size={20} color="#007AFF" style={{ marginRight: 6 }} />
        <Text style={styles.refnumText}>{shipment.refnumValue2}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.cardBox}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("ShipmentDetailsScreenSP", { shipmentGid: shipment.shipmentGid })}
      disabled={!!loadingEvent}
    >
      <View style={styles.cardContent}>
        {/* Action buttons row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.denyBtn, !canDeny && { opacity: 0.5 }]}
            onPress={() => handleEvent("CSDEN")}
            disabled={!!loadingEvent || !canDeny}
          >
            {loadingEvent === "CSDEN" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <MaterialIcons name="cancel" size={16} color="#fff" />
                <Text style={styles.buttonText}>DENY</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn, !canAccept && { opacity: 0.5 }]}
            onPress={() => handleEvent("CSAPR")}
            disabled={!!loadingEvent || !canAccept}
          >
            {loadingEvent === "CSAPR" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Feather name="user-check" size={16} color="#fff" />
                <Text style={styles.buttonText}>ACCEPT</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Header row with ID and status */}
        <View style={styles.headerRow}>
          <FontAwesome5 name="truck" size={18} color={accentColor} style={{ marginRight: 8 }} />
          <Text style={styles.gid}>{shipment.shipmentGid}</Text>
          <View style={[styles.statusChip, { backgroundColor: statusBgColor }]}>
            {React.createElement(statusIconLib, {
              name: statusIcon,
              size: 16,
              color: statusTextColor,
              style: { marginRight: 4 }
            })}
            <Text style={{ color: statusTextColor, fontWeight: "bold", fontSize: 13 }}>{statusText}</Text>
          </View>
        </View>
        
        {refnum1Views}
        {refnum2View}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: "hidden",
  },
  cardContent: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  gid: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#222",
    flex: 1,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    minWidth: 60,
  },
  acceptBtn: {
    backgroundColor: "#2196F3",
  },
  denyBtn: {
    backgroundColor: "#F44336",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 80,
    justifyContent: "center",
  },
  refnumRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  refnumText: {
    fontSize: 15,
    color: "#444",
  },
});