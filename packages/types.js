"use strict";
exports.__esModule = true;
exports.makeAddress = function(address, balance, keyIndex, security) {
  return {
    address: address,
    keyIndex: keyIndex,
    security: security,
    balance: balance
  };
};
/* List of IRI Commands */
var ProtocolCommand;
(function(ProtocolCommand) {
  ProtocolCommand["GET_NODE_INFO"] = "getNodeInfo";
  ProtocolCommand["GET_NEIGHBORS"] = "getNeighbors";
  ProtocolCommand["ADD_NEIGHBORS"] = "addNeighbors";
  ProtocolCommand["REMOVE_NEIGHBORS"] = "removeNeighbors";
  ProtocolCommand["GET_TIPS"] = "getTips";
  ProtocolCommand["FIND_TRANSACTIONS"] = "findTransactions";
  ProtocolCommand["GET_HBYTES"] = "getBytes";
  ProtocolCommand["GET_INCLUSION_STATES"] = "getInclusionStates";
  ProtocolCommand["GET_BALANCES"] = "getBalances";
  ProtocolCommand["GET_TRANSACTIONS_TO_APPROVE"] = "getTransactionsToApprove";
  ProtocolCommand["ATTACH_TO_TANGLE"] = "attachToTangle";
  ProtocolCommand["INTERRUPT_ATTACHING_TO_TANGLE"] =
    "interruptAttachingToTangle";
  ProtocolCommand["BROADCAST_TRANSACTIONS"] = "broadcastTransactions";
  ProtocolCommand["STORE_TRANSACTIONS"] = "storeTransactions";
  ProtocolCommand["CHECK_CONSISTENCY"] = "checkConsistency";
  ProtocolCommand["WERE_ADDRESSES_SPENT_FROM"] = "wereAddressesSpentFrom";
})(
  (ProtocolCommand = exports.ProtocolCommand || (exports.ProtocolCommand = {}))
);
/* Util methods */
exports.asArray = function(x) {
  return Array.isArray(x) ? x : [x];
};
exports.getOptionsWithDefaults = function(defaults) {
  return function(options) {
    return Object.assign({}, defaults, options);
  };
}; // tslint:disable-line prefer-object-spread
