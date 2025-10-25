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
    // Step 1: Quick credential validation using /login endpoint
    const loginRes = await fetch(`${HOST}/GC3/api/login`, {
      method: "POST",
      headers,
      body: "",
    });

    if (!loginRes.ok) {
      throw new Error(`Invalid credentials (${loginRes.status})`);
    }

    // Step 2: Get full user profile with roles/privileges using /auth endpoint
    const authRes = await fetch(`${HOST}/GC3/api/auth`, {
      method: "POST",
      headers,
      body: "",
    });

    if (!authRes.ok) {
      throw new Error(`Authorization failed (${authRes.status})`);
    }

    const data = await authRes.json();
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
