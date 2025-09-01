import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";
import { buildDriverSearchRefnumUpdateXML } from "../utils/xmlBuilders";

// Modular service to send driver refnum update for SEARCH_TRAILER_ID
export async function sendDriverRefnumUpdate({ driverGid, trailerId }) {
  // Build XML payload using xmlBuilders
  const xml = buildDriverSearchRefnumUpdateXML(driverGid, trailerId);

  // Debug: log the XML payload
  console.log("[sendDriverRefnumUpdate] XML Payload:", xml);

  const token = await getStoredToken();
  const response = await fetch(`${HOST}/GC3/glog.integration.servlet.WMServlet`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/xml",
    },
    body: xml,
  });

  // Debug: log the response status
  console.log("[sendDriverRefnumUpdate] Response Status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.log("[sendDriverRefnumUpdate] Error Response:", text);
    throw new Error(text || "Failed to update driver refnum");
  }
  const text = await response.text();
  console.log("[sendDriverRefnumUpdate] Success Response:", text);
  return text;
}
