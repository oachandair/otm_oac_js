// Builder for shipment event JSON payload
export function buildShipmentEventGPSPayload({ shipmentGid, location, quickCode = "CSDPK", remarkText = "AAAA-XX-CCC" }) {
  const eventDateMillis = Date.now();
  return {
    stopNumber: -1,
    eventDateTz: "Africa/Casablanca",
    shipmentGid,
    eventDateOffset: 0,
    quickCode,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    eventDateMillis,
    remarkText,
  };
}
