import { loginOTM } from "../services/authService";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
export default function LoginScreen({ navigation }) {
  const [domain] = useState("TMSA");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const fullUsername = `${domain}.${username}`;
      const userData = await loginOTM(fullUsername, password);
      login(userData);
      setMessage(`Welcome ${userData.userId}`);
      setMessageType('success');
      setTimeout(() => {
        setMessage("");
        navigation.navigate("Subzones");
      }, 1500);
    } catch (err) {
      setMessage(err.message || "Login failed");
      setMessageType('error');
  setTimeout(() => setMessage("") , 2000);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {message ? (
        <View style={{
          backgroundColor: messageType === 'success' ? '#D1FADF' : '#FAD1D1',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: messageType === 'success' ? '#34C759' : '#FF3B30',
        }}>
          <Text style={{
            color: messageType === 'success' ? '#228B22' : '#B22222',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>{message}</Text>
        </View>
      ) : null}
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login to OTM</Text>
      <TextInput
        placeholder="Domain"
        value={domain}
        editable={false}
        style={{ backgroundColor: '#eee', marginBottom: 10, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
      />
      <TextInput
        placeholder="Username"
        onChangeText={text => setUsername(text.replace(/\s+$/, "").toUpperCase())}
        value={username}
        autoCapitalize="characters"
        style={{ marginBottom: 10, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ marginBottom: 20, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
