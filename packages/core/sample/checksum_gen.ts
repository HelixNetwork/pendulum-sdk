/**
 *  Given an address, it will append checksum  if it is a valid address
 */
import { addChecksum } from "@helixnetwork/checksum";

const address = [
  "0219c68a8de8a82504832a8d17d64466453689dae9bbc21affe5f25efa3202c90e",
  "025dac12f2de9f9ea7848a0ede74657b24ecdf966505dae2a6bbe410c08a69bd14",
  "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2",
  "000000000000000000000000000000000000000000000000000000000000000000"
];

async function checksum(addr: any) {
  const m = await addChecksum(addr);
  console.log(JSON.stringify(m));
}

checksum(address);
