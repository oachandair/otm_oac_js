import { encode as btoa } from "base-64";
import * as SecureStore from "expo-secure-store";
import { HOST } from "../utils/constants";

export async function loginOTM(username, password) {
  const authToken = btoa(`${username}:${password}`);
  const headers = {
    "Authorization": `Basic ${authToken}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(`${HOST}/GC3/api/auth`, {
      method: "POST",
      headers,
      body: "",
    });

    if (!res.ok) {
      throw new Error(`Login failed (${res.status})`);
    }

    const data = await res.json();
    await SecureStore.setItemAsync("auth", authToken);

    return {
      userId: data.userId,
      roles: data.roles,
      privileges: data.privileges,
      authToken,
    };
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

export async function getStoredToken() {
  return await SecureStore.getItemAsync("auth");
}

export async function logoutOTM() {
  await SecureStore.deleteItemAsync("auth");
}
