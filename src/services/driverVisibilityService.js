import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";
import { buildVisibilitySourceUpdateXML } from "../utils/xmlBuilders";

export async function sendDriverVisibilitySourceUpdate({ driverGid, subzone }) {
  const token = await getStoredToken();
  const xml = buildVisibilitySourceUpdateXML(driverGid, subzone);
  console.log("[DEBUG] VisibilitySource XML:\n", xml);

  const res = await fetch(`${HOST}/GC3/glog.integration.servlet.WMServlet`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/xml",
    },
    body: xml,
  });

  if (!res.ok) {
    throw new Error(`Failed to post visibility source update (${res.status})`);
  }

  return true;
}
