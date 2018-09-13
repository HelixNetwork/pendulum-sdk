import { composeAPI } from "@helix/core";
import { createHttpClient } from "@helix/http-client";
import { createGetNodeInfo } from "@helix/core";

const helix = composeAPI({
  provider: "https://helix:LW59AG75A84GSEES@hlxtest.net:14701"
});
const client = createHttpClient({
  provider: "https://helix:LW59AG75A84GSEES@hlxtest.net:14701"
});

const getNodeInfo = createGetNodeInfo(client);
helix
  .getNodeInfo()
  .then(info => console.log(info))
  .catch(err => {});
