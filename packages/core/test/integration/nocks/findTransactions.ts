import * as nock from "nock";
import {
  ProtocolCommand,
  FindTransactionsCommand,
  FindTransactionsResponse
} from "../../../../types";
import headers from "./headers";

export const emptyFindTransactionsCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: [
    "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
  ]
};

export const emptyFindTransactionsResponse: FindTransactionsResponse = {
  hashes: []
};

export const findTransactionsByAddressesCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  addresses: [
    "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
  ]
};

export const findTransactionsByBundlesCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  bundles: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const findTransactionsByTagsCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  tags: ["a".repeat(2 * 8), "b".repeat(2 * 8)]
};

export const findTransactionsByApproveesCommand: FindTransactionsCommand = {
  command: ProtocolCommand.FIND_TRANSACTIONS,
  approvees: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const findTransactionsByAddressesResponse: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const findTransactionsByBundlesResponse: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const findTransactionsByTagsResponse: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const findTransactionsByApproveesResponse: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

export const findTransactionsByAddressesNock = nock(
  "http://localhost:14265",
  headers
)
  .persist()
  .post("/", findTransactionsByAddressesCommand)
  .reply(200, findTransactionsByAddressesResponse);

export const findTransactionsByBundlesNock = nock(
  "http://localhost:14265",
  headers
)
  .persist()
  .post("/", findTransactionsByBundlesCommand)
  .reply(200, findTransactionsByBundlesResponse);

export const findTransactionsByTagsNock = nock(
  "http://localhost:14265",
  headers
)
  .persist()
  .post("/", findTransactionsByTagsCommand)
  .reply(200, findTransactionsByTagsResponse);

export const findTransactionsByApproveesNock = nock(
  "http://localhost:14265",
  headers
)
  .persist()
  .post("/", findTransactionsByApproveesCommand)
  .reply(200, findTransactionsByApproveesResponse);

export const emptyFindTransactionsNock = nock("http://localhost:14265", headers)
  .persist()
  .post("/", emptyFindTransactionsCommand)
  .reply(200, emptyFindTransactionsResponse);

export const findTransactionsResponse: FindTransactionsResponse = {
  hashes: ["a".repeat(2 * 32), "b".repeat(2 * 32)]
};

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: [
      "464a48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
      "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, findTransactionsResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    bundles: ["0".repeat(2 * 32)]
  })
  .reply(200, findTransactionsResponse);

nock("http://localhost:14265", headers)
  .persist()
  .post("/", {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: [
      "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
      "abcd48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356"
    ]
  })
  .reply(200, findTransactionsResponse);
