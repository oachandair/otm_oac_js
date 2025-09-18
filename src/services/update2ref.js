import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";
import { buildDoubleRefnumUpdateXML } from "../utils/xmlBuilders";

export async function sendDriverDoubleRefnumUpdate({ driverGid, qualifier1, value1, qualifier2, value2 }) {
  const token = await getStoredToken();
  const xml = buildDoubleRefnumUpdateXML(driverGid, qualifier1, value1, qualifier2, value2);
  console.log("[DEBUG] Double Refnum XML:\n", xml);

  const res = await fetch(`${HOST}/GC3/glog.integration.servlet.WMServlet`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/xml",
    },
    body: xml,
  });

  if (!res.ok) {
    throw new Error(`Failed to post double refnum update (${res.status})`);
  }

  return true;
}