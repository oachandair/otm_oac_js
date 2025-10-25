import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";

export async function getVisibleShipments() {
  const token = await getStoredToken();
  const res = await fetch(`${HOST}/GC3/api/shipment/`, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch shipments (${res.status})`);
  }
  const json = await res.json();
  // Map shipments and attach stop order refnumValue2s with stop number
  return json.shipments?.map(s => ({
    shipmentGid: s.shipmentGid,
    refnumLabel1: s.refnumLabel1,
    refnumValue1: s.refnumValue1,
    refnumLabel2: s.refnumLabel2,
    refnumValue2: s.refnumValue2,
    stopOrderRefnums: (json.shipmentStopOrders || [])
      .filter(so => so.shipmentGid === s.shipmentGid)
      .map(so => ({ stopNumber: so.stopNumber, refnumValue2: so.refnumValue2 }))
  })) || [];
}