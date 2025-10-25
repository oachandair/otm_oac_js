import { getStoredToken } from "./authService";
import { HOST } from "../utils/constants";

function getRefnumValue(shipment, qualGid) {
  return shipment.shipmentRefnum?.find(
    ref => ref.shipmentRefnumBeanData?.shipmentRefnumQualGid === qualGid
  )?.shipmentRefnumBeanData?.shipmentRefnumValue || null;
}

export async function getShipmentDetails(shipmentGid) {
  const token = await getStoredToken();
  const res = await fetch(`${HOST}/GC3/api/sdo/Shipment?id=${shipmentGid}`, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch shipment details (${res.status})`);
  }
  const json = await res.json();
  const shipment = json.Shipment || null;
  if (!shipment) return null;

  // Use utility for refnum extraction
  const mobileView1 = getRefnumValue(shipment, "TMSA.MOBILE_VIEW1");
  const mobileView2 = getRefnumValue(shipment, "TMSA.MOBILE_VIEW2");
  const latitude = getRefnumValue(shipment, "TMSA.LATITUDE");
  const longitude = getRefnumValue(shipment, "TMSA.LONGITUDE");
  // Add more as needed...

  // Extract statusControl and statusAttach from shipmentStatus
  let statusControl = null;
  let statusAttach = null;
  if (Array.isArray(shipment.shipmentStatus)) {
    shipment.shipmentStatus.forEach(status => {
      const typeGid = status.shipmentStatusBeanData?.statusTypeGid;
      const valueGid = status.shipmentStatusBeanData?.statusValueGid;
      if (typeGid === "TMSA.STATE_CONTROL" && valueGid?.startsWith("TMSA.CONTROL_")) {
        statusControl = valueGid.replace("TMSA.CONTROL_", "");
      }
      if (typeGid === "TMSA.STATE_ATTACH" && valueGid?.startsWith("TMSA.ATTACH_")) {
        statusAttach = valueGid.replace("TMSA.ATTACH_", "");
      }
    });
  }

  return {
    ...shipment,
    mobileView1,
    mobileView2,
    latitude,
    longitude,
    statusControl,
    statusAttach,
    // Add other extracted fields here
  };
}