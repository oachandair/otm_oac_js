import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { loginOTM } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [domain] = useState("TMSA");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const fullUsername = `${domain}.${username}`;
      const userData = await loginOTM(fullUsername, password);
      login(userData);
      Alert.alert("Login Success", `Welcome ${userData.userId}`);
      navigation.navigate("Subzones");
    } catch (err) {
      Alert.alert("Login failed", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login to OTM</Text>
      <TextInput
        placeholder="Domain"
        value={domain}
        editable={false}
        style={{ backgroundColor: '#eee', marginBottom: 10, padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
      />
      <TextInput
  placeholder="Username"
  onChangeText={text => setUsername(text.replace(/\s+$/, ""))}
  value={username}
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
