import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { loginOTM } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [domain] = useState("TMSA");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const { login, authState } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const fullUsername = `${domain}.${username}`;
      const userData = await loginOTM(fullUsername, password);
      login(userData);
      setMessage(`Welcome ${userData.userId}`);
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        navigation.navigate("Subzones");
      }, 1500);
    } catch (err) {
      setMessage("Login failed");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  console.log(authState.roles); // ["TMSA.SUPERVISOR_ROLE", "SUPERVISOR_ROLE"]

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F8F8F8" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1, padding: 24 }}>
          {/* Header block at the top */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#007AFF",
              marginBottom: 0, // minimized margin
              letterSpacing: 1,
              marginTop: 12,
            }}>
              Welcome to OTM
            </Text>
            <Image
              source={require("../../assets/tmpa_logo.png")}
              style={{
                width: 120,
                height: 120,
                resizeMode: "contain",
                marginTop: 2,      // add a tiny margin if needed
                marginBottom: 4,
              }}
            />
            <Text style={{
              fontSize: 16,
              color: "#555",
              marginBottom: 0,
              textAlign: "center",
            }}>
              Please sign in to continue
            </Text>
          </View>
          {/* Login form pushed up */}
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            {message ? (
              <View style={{
                backgroundColor: messageType === 'success' ? '#D1FADF' : '#FAD1D1',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: messageType === 'success' ? '#34C759' : '#FF3B30',
                width: "100%",
              }}>
                <Text style={{
                  color: messageType === 'success' ? '#228B22' : '#B22222',
                  fontSize: 16,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>{message}</Text>
              </View>
            ) : null}
            <TextInput
              placeholder="Username"
              onChangeText={text => setUsername(text.replace(/\s+$/, "").toUpperCase())}
              value={username}
              autoCapitalize="characters"
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                backgroundColor: "#fff",
                fontSize: 16,
              }}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              style={{
                width: "100%",
                marginBottom: 20,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
                backgroundColor: "#fff",
                fontSize: 16,
              }}
            />
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading || !username || !password}
              style={{
                width: "100%",
                backgroundColor: loading ? "#A5D6A7" : "#007AFF",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* Version fixed at the bottom of the screen */}
      <Text
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#888",
          fontSize: 14,
          letterSpacing: 1,
          zIndex: 10,
        }}
      >
        Version v1.14
      </Text>
    </>
  );
}
