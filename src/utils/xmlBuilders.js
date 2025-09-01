import { DOMAIN } from "./constants";

export function buildVisibilitySourceUpdateXML(driverGid, subzone) {
  const [, xid] = driverGid.split(".");

  return `
<Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
  <TransmissionHeader/>
  <TransmissionBody>
    <GLogXMLElement>
      <otm:GenericStatusUpdate xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
        <otm:GenericStatusObjectType>DRIVER</otm:GenericStatusObjectType>
        <otm:Gid>
          <otm:DomainName>${DOMAIN}</otm:DomainName>
          <otm:Xid>${xid}</otm:Xid>
        </otm:Gid>
        <otm:TransactionCode>U</otm:TransactionCode>
        <otm:Refnum>
          <otm:RefnumQualifierGid>
            <otm:Gid>
              <otm:DomainName>${DOMAIN}</otm:DomainName>
              <otm:Xid>VISIBILITY_SRC</otm:Xid>
            </otm:Gid>
          </otm:RefnumQualifierGid>
          <otm:RefnumValue>${subzone}</otm:RefnumValue>
        </otm:Refnum>
      </otm:GenericStatusUpdate>
    </GLogXMLElement>
  </TransmissionBody>
</Transmission>
  `.trim();
}

export function buildGenericStatusUpdateXML(driverGid, subzone) {
  const [, xid] = driverGid.split(".");

  return `
<Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
  <TransmissionHeader/>
  <TransmissionBody>
    <GLogXMLElement>
      <otm:GenericStatusUpdate xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
        <otm:GenericStatusObjectType>DRIVER</otm:GenericStatusObjectType>
        <otm:Gid>
          <otm:DomainName>${DOMAIN}</otm:DomainName>
          <otm:Xid>${xid}</otm:Xid>
        </otm:Gid>
        <otm:TransactionCode>U</otm:TransactionCode>
        <otm:Refnum>
          <otm:RefnumQualifierGid>
            <otm:Gid>
              <otm:DomainName>${DOMAIN}</otm:DomainName>
              <otm:Xid>ACTIVITY</otm:Xid>
            </otm:Gid>
          </otm:RefnumQualifierGid>
          <otm:RefnumValue>${subzone}</otm:RefnumValue>
        </otm:Refnum>
      </otm:GenericStatusUpdate>
    </GLogXMLElement>
  </TransmissionBody>
</Transmission>
  `.trim();
}

export function buildDriverSearchRefnumUpdateXML(driverGid, trailerId) {
  const [, xid] = driverGid.split(".");
  return `
<Transmission xmlns="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
    <TransmissionHeader/>
    <TransmissionBody>
        <GLogXMLElement>
            <otm:GenericStatusUpdate xmlns:otm="http://xmlns.oracle.com/apps/otm/transmission/v6.4">
                <!-- Target Object -->
                <otm:GenericStatusObjectType>DRIVER</otm:GenericStatusObjectType>
                <!-- Object Identification -->
                <otm:Gid>
                    <otm:DomainName>TMSA</otm:DomainName>
                    <otm:Xid>${xid}</otm:Xid>
                </otm:Gid>
                <!-- Update Action -->
                <otm:TransactionCode>U</otm:TransactionCode>
                <!-- Status Update -->
                <otm:Status>
                    <otm:StatusTypeGid>
                        <!-- <<< THIS IS THE NEW BLOCK -->
                        <otm:Gid>
                            <otm:DomainName>TMSA</otm:DomainName>
                            <otm:Xid>CLEAN_STATE</otm:Xid>
                            <!-- Most OTM setups use "SHIPMENT STATUS" -->
                        </otm:Gid>
                    </otm:StatusTypeGid>
                    <otm:StatusValueGid>
                        <otm:Gid>
                            <otm:DomainName>TMSA</otm:DomainName>
                            <otm:Xid>CLEAN_NOTCLEAN</otm:Xid>
                        </otm:Gid>
                    </otm:StatusValueGid>
                </otm:Status>
                <!-- Add Remark -->
                <!-- Add Refnum -->
                <otm:Refnum>
                    <otm:RefnumQualifierGid>
                        <otm:Gid>
                            <otm:DomainName>TMSA</otm:DomainName>
                            <otm:Xid>SEARCH_TRAILER_ID</otm:Xid>
                        </otm:Gid>
                    </otm:RefnumQualifierGid>
                    <otm:RefnumValue>${trailerId}</otm:RefnumValue>
                </otm:Refnum>
            </otm:GenericStatusUpdate>
        </GLogXMLElement>
    </TransmissionBody>
</Transmission>
  `.trim();
}
