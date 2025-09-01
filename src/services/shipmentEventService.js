import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";
import { buildShipmentEventGPSPayload } from "../utils/jsonBuilders";

export async function sendShipmentEventGPS({ shipmentGid, location, quickCode = "CSDPK", remarkText = "AAAA-XX-CCC" }) {
  const eventPayload = buildShipmentEventGPSPayload({ shipmentGid, location, quickCode, remarkText });
  const token = await getStoredToken();
  const res = await fetch(`${HOST}/GC3/api/shipment/add_event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${token}`,
    },
    body: JSON.stringify(eventPayload),
  });
  const text = await res.text();
  console.log("[DEBUG] Shipment Event Response Status:", res.status);
  console.log("[DEBUG] Shipment Event Response Body:", text);
  if (!res.ok) {
    throw new Error(`Failed to send shipment event (${res.status}): ${text}`);
  }
  return text;
}
