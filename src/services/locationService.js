export async function getSubzonesFromLocationGid(locationGid) {
  const token = await getStoredToken();
  const res = await fetch(`${HOST}/GC3/api/sdo/Location?id=${locationGid}`, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch location ${locationGid}`);
  }

  const json = await res.json();
  const refnums = json?.Location?.locationRefnum || [];

  return refnums
    .filter(r => r.locationRefnumBeanData?.locationRefnumQualGid === "TMSA.SUBZONES")
    .map(r => ({
      xid: r.locationRefnumBeanData.locationRefnumValue,
      gid: r.locationRefnumBeanData.locationGid,
    }));
}
import { getStoredToken } from "./authService";
import { HOST, DOMAIN } from "../utils/constants";

export async function getSubzonesFromProcesses() {
  const token = await getStoredToken();

  const res = await fetch(`${HOST}/GC3/api/sdo/Location?id=${DOMAIN}.PROCESSES`, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch PROCESSES location`);
  }

  const json = await res.json();
  const refnums = json?.Location?.locationRefnum || [];

  return refnums
    .filter(r => r.locationRefnumBeanData?.locationRefnumQualGid === `${DOMAIN}.SUBZONES`)
    .map(r => {
      const xid = r.locationRefnumBeanData.locationRefnumValue;
      return {
        xid,
        gid: `${DOMAIN}.${xid}`,
      };
    });
}
