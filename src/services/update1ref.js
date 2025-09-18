import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";
import { buildSingleRefnumUpdateXML } from "../utils/xmlBuilders";

// Update a single refnum for a driver
export async function sendDriverSingleRefnumUpdate({ driverGid, refnumQualifier, refnumValue }) {
  const token = await getStoredToken();
  const xml = buildSingleRefnumUpdateXML(driverGid, refnumQualifier, refnumValue);
  console.log("[DEBUG] Single Refnum XML:\n", xml);

  const res = await fetch(`${HOST}/GC3/glog.integration.servlet.WMServlet`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/xml",
    },
    body: xml,
  });

  if (!res.ok) {
    throw new Error(`Failed to post single refnum update (${res.status})`);
  }

  return true;
}