import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import { seed } from "@helixnetwork/samples";
import { createGetNewAddress } from "../src/createGetNewAddress";
const client = createHttpClient();
const getNewAddress = createGetNewAddress(client, "lib");

async function generateAddresses() {
  const addresses: string[] = new Array<string>(3);
  const addressesWithChecksum: string[] = new Array<string>(3);
  let newAddress: string = "";

  let addr = await getNewAddress(seed, { index: 0, total: 3 });

  for (let i = 0; i < 3; i++) {
    console.log(
      "address for seed=" + seed + " index=" + i + " security=2 " + addr[i]
    );
    if (i == 0) {
      newAddress = addr[0];
    }
    addresses[i] = addr[i];
    addressesWithChecksum[i] = addChecksum(addr[i]);
  }
  addr = await getNewAddress(seed, { index: 0, total: 3, security: 1 });
  for (let i = 0; i < 3; i++) {
    console.log(
      "address for seed=" + seed + " index=" + i + " security=1 " + addr[i]
    );
  }

  console.log("-------------------------");
  console.log("export const addresses = " + JSON.stringify(addresses) + ";");
  console.log(
    "export const addressesWithChecksum = " +
      JSON.stringify(addressesWithChecksum) +
      ";"
  );
  console.log('export const newAddress = "' + newAddress + '";');
  console.log(
    'export const newAddressWithChecksum = "' + addChecksum(newAddress) + '";'
  );
}

generateAddresses();
