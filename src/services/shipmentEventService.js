import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";
import { buildShipmentEventGPSPayload, buildShipmentEventINFPayload } from "../utils/jsonBuilders";

export async function sendShipmentEvent({ type, ...args }) {
  let eventPayload;
  if (type === "GPS") {
    eventPayload = buildShipmentEventGPSPayload(args);
  } else if (type === "INF") {
    eventPayload = buildShipmentEventINFPayload(args);
  } else {
    throw new Error("Unknown event type");
  }

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
