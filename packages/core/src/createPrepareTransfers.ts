import * as Promise from "bluebird";

import { hbits, hbytes, hex } from "@helix/converter";
import { addEntry, addHBytes, finalizeBundle } from "@helix/bundle";
import { isValidChecksum, removeChecksum } from "@helix/checksum";
import {
  key,
  normalizedBundleHash,
  signatureFragment,
  subseed,
  computePublicNonces
} from "@helix/signing";
import { asFinalTransactionHBytes } from "@helix/transaction-converter";
import * as errors from "../../errors";
import {
  arrayValidator,
  inputValidator,
  isHBytes,
  remainderAddressValidator,
  securityLevelValidator,
  seedValidator,
  transferValidator,
  validate
} from "../../guards";
import {
  Address,
  asArray,
  Callback,
  getOptionsWithDefaults,
  Provider,
  Transaction,
  Transfer,
  HBytes
} from "../../types";
import { asyncPipe } from "../../utils";
import { createGetInputs, createGetNewAddress } from "./";
import HMAC from "./hmac";
import {
  HASH_BYTE_SIZE,
  NULL_HASH_HBYTES,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
} from "../../constants";

const HASH_LENGTH = HASH_BYTE_SIZE;
const SIGNATURE_MESSAGE_FRAGMENT_LENGTH = SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE;
const KEY_FRAGMENT_LENGTH = 3 * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE;
const SECURITY_LEVEL = 2;

export interface PrepareTransfersOptions {
  readonly inputs: ReadonlyArray<Address>;
  readonly address?: HBytes; // Deprecate
  readonly remainderAddress?: HBytes;
  readonly security: number;
  readonly hmacKey?: HBytes;
}

const defaults: PrepareTransfersOptions = {
  inputs: [],
  address: undefined,
  remainderAddress: undefined,
  security: 2,
  hmacKey: undefined
};

export const getPrepareTransfersOptions = (
  options: Partial<PrepareTransfersOptions>
) => ({
  ...getOptionsWithDefaults(defaults)(options),
  remainderAddress: options.address || options.remainderAddress || undefined
});

export interface PrepareTransfersProps {
  readonly transactions: ReadonlyArray<Transaction>;
  readonly hbytes: ReadonlyArray<HBytes>;
  readonly transfers: ReadonlyArray<Transfer>;
  readonly seed: HBytes;
  readonly security: number;
  readonly inputs: ReadonlyArray<Address>;
  readonly timestamp: number;
  readonly remainderAddress?: HBytes;
  readonly address?: HBytes;
  readonly hmacKey?: HBytes;
}

/**
 * Create a [`prepareTransfers`]{@link #module_core.prepareTransfers} function by passing an optional newtowrk `provider`.
 * It is possible to prepare and sign transactions offline, by omitting the provider option.
 *
 * @method createPrepareTransfers
 *
 * @memberof module:core
 *
 * @param {Provider} [provider] - Optional network provider to fetch inputs and remainder address.
 * In case this is omitted, proper input objects and remainder should be passed
 * to [`prepareTransfers`]{@link #module_core.prepareTransfers}, if required.
 *
 * @return {Function} {@link #module_core.prepareTransfers `prepareTransfers`}
 */
export const createPrepareTransfers = (
  provider?: Provider,
  now: () => number = () => Date.now(),
  caller?: string
) => {
  const addInputs = createAddInputs(provider);
  const addRemainder = createAddRemainder(provider);

  /**
   * Prepares the transaction hbytes by generating a bundle, filling in transfers and inputs,
   * adding remainder and signing. It can be used to generate and sign bundles either online or offline.
   * For offline usage, please see [`createPrepareTransfers`]{@link #module_core.createPrepareTransfers}
   * which creates a `prepareTransfers` without a network provider.
   *
   * @method prepareTransfers
   *
   * @memberof module:core
   *
   * @param {string} seed
   *
   * @param {object} transfers
   *
   * @param {object} [options]
   * @param {Input[]} [options.inputs] Inputs used for signing. Needs to have correct security, keyIndex and address value
   * @param {Hash} [options.inputs[].address] Input address hbytes
   * @param {number} [options.inputs[].keyIndex] Key index at which address was generated
   * @param {number} [options.inputs[].security = 2] Security level
   * @param {number} [options.inputs[].balance] Balance in iotas
   * @param {Hash} [options.address] Remainder address
   * @param {Number} [options.security] Security level to be used for getting inputs and reminder address
   * @property {Hash} [options.hmacKey] HMAC key used for attaching an HMAC
   *
   * @param {function} [callback] Optional callback
   *
   * @return {Promise}
   * @fulfil {array} hbytes Returns bundle hbytes
   * @reject {Error}
   * - `INVALID_SEED`
   * - `INVALID_TRANSFER_ARRAY`
   * - `INVALID_INPUT`
   * - `INVALID_REMAINDER_ADDRESS`
   * - `INSUFFICIENT_BALANCE`
   * - `NO_INPUTS`
   * - `SENDING_BACK_TO_INPUTS`
   * - Fetch error, if connected to network
   */
  return function prepareTransfers(
    seed: HBytes,
    transfers: ReadonlyArray<Transfer>,
    options: Partial<PrepareTransfersOptions> = {},
    callback?: Callback<ReadonlyArray<HBytes>>
  ): Promise<ReadonlyArray<HBytes>> {
    if (caller !== "lib") {
      if (options.address) {
        /* tslint:disable-next-line:no-console */
        console.warn(
          "`options.address` is deprecated and will be removed in v2.0.0. Use `options.remainderAddress` instead."
        );
      }

      if (isHBytes(seed) && seed.length < 81) {
        /* tslint:disable-next-line:no-console */
        console.warn(
          "WARNING: Seeds with less length than 81 hbytes are not secure! Use a random, 81-hbytes long seed!"
        );
      }
    }

    const props = Promise.resolve(
      validatePrepareTransfers({
        transactions: [],
        hbytes: [],
        seed,
        transfers: transfers.map(transfer => ({
          ...transfer,
          message: transfer.message || "",
          tag: transfer.tag || ""
        })),
        timestamp: Math.floor(
          (typeof now === "function" ? now() : Date.now()) / 1000
        ),
        ...getPrepareTransfersOptions(options)
      })
    );

    return asyncPipe<PrepareTransfersProps>(
      addHMACPlaceholder,
      addTransfers,
      addInputs,
      addRemainder,
      verifyNotSendingToInputs,
      finalize,
      addSignatures,
      addHMAC,
      asTransactionHBytes
    )(props)
      .then(({ hbytes }: PrepareTransfersProps) => hbytes)
      .asCallback(callback);
  };
};

export const validatePrepareTransfers = (props: PrepareTransfersProps) => {
  const { seed, transfers, inputs, security } = props;
  const remainderAddress = props.address || props.remainderAddress;

  validate(
    seedValidator(seed),
    securityLevelValidator(security),
    arrayValidator(transferValidator)(transfers),
    !!remainderAddress && remainderAddressValidator(remainderAddress),
    inputs.length > 0 && arrayValidator(inputValidator)(inputs)
  );

  return props;
};

export const addHMACPlaceholder = (
  props: PrepareTransfersProps
): PrepareTransfersProps => {
  const { hmacKey, transfers } = props;

  return hmacKey
    ? {
        ...props,
        transfers: transfers.map(
          (transfer, i) =>
            transfer.value > 0
              ? {
                  ...transfer,
                  message: NULL_HASH_HBYTES + transfer.message
                }
              : transfer
        )
      }
    : props;
};

export const addTransfers = (
  props: PrepareTransfersProps
): PrepareTransfersProps => {
  const { transactions, transfers, timestamp } = props;

  return {
    ...props,
    transactions: transfers.reduce((acc, { address, value, tag, message }) => {
      const length = Math.ceil(
        ((message || "").length || 1) / SIGNATURE_MESSAGE_FRAGMENT_LENGTH
      );

      return addEntry(acc, {
        address: removeChecksum(address),
        value,
        tag,
        timestamp,
        length,
        signatureMessageFragments: Array(length)
          .fill("")
          .map((_, i) =>
            (message || "").slice(
              i * SIGNATURE_MESSAGE_FRAGMENT_LENGTH,
              (i + 1) * SIGNATURE_MESSAGE_FRAGMENT_LENGTH
            )
          )
      });
    }, transactions)
  };
};

export const createAddInputs = (provider?: Provider) => {
  const getInputs = provider ? createGetInputs(provider) : undefined;

  return (props: PrepareTransfersProps): Promise<PrepareTransfersProps> => {
    const {
      transactions,
      transfers,
      inputs,
      timestamp,
      seed,
      security
    } = props;
    const threshold = transfers.reduce((sum, { value }) => (sum += value), 0);

    if (threshold === 0) {
      return Promise.resolve(props);
    }

    if (
      inputs.length &&
      threshold > inputs.reduce((acc, input) => (acc += input.balance), 0)
    ) {
      throw new Error(
        inputs.length ? errors.INSUFFICIENT_BALANCE : errors.NO_INPUTS
      );
    }

    return (!getInputs || inputs.length
      ? Promise.resolve(inputs)
      : getInputs(seed, { security, threshold }).then(
          response => response.inputs
        )
    ).then(res => ({
      ...props,
      inputs: res,
      transactions: res.reduce(
        (acc, input) =>
          addEntry(acc, {
            length: 1, //input.security, one entry even if security level is higher than 1
            address: removeChecksum(input.address),
            value: -input.balance,
            timestamp: timestamp || Math.floor(Date.now() / 1000)
          }),
        transactions
      )
    }));
  };
};

export const createAddRemainder = (provider?: Provider) => {
  const getNewAddress = provider
    ? createGetNewAddress(provider, "lib")
    : undefined;

  return (
    props: PrepareTransfersProps
  ): PrepareTransfersProps | Promise<PrepareTransfersProps> => {
    const {
      transactions,
      remainderAddress,
      seed,
      security,
      inputs,
      timestamp
    } = props;

    // Values of transactions in the bundle should sum up to 0.
    const value = transactions.reduce(
      (acc, transaction) => (acc += transaction.value),
      0
    );

    // Value > 0 indicates insufficient balance in inputs.
    if (value > 0) {
      throw new Error(errors.INSUFFICIENT_BALANCE);
    }

    // If value is already zero no remainder is required
    if (value === 0) {
      return props;
    }

    if (!provider && !remainderAddress) {
      throw new Error(errors.INVALID_REMAINDER_ADDRESS);
    }

    return (remainderAddress
      ? Promise.resolve(remainderAddress)
      : getNewAddress!(seed, {
          index: getRemainderAddressStartIndex(inputs),
          security
        })
    ).then(address => {
      address = asArray(address)[0];

      return {
        ...props,
        remainderAddress: address,
        transactions: addEntry(transactions, {
          length: 1,
          address,
          value: Math.abs(value),
          timestamp: timestamp || Math.floor(Date.now() / 1000)
        })
      };
    });
  };
};

export const getRemainderAddressStartIndex = (
  inputs: ReadonlyArray<Address>
): number => [...inputs].sort((a, b) => a.keyIndex - b.keyIndex)[0].keyIndex;

export const verifyNotSendingToInputs = (
  props: PrepareTransfersProps
): PrepareTransfersProps => {
  const { transactions } = props;
  const isSendingToInputs = transactions
    .filter(({ value }) => value < 0)
    .some(
      output =>
        transactions.findIndex(
          input => input.value > 0 && input.address === output.address
        ) > -1
    );

  if (isSendingToInputs) {
    throw new Error(errors.SENDING_BACK_TO_INPUTS);
  }

  return props;
};

export const finalize = (
  props: PrepareTransfersProps
): PrepareTransfersProps => ({
  ...props,
  transactions: finalizeBundle(props.transactions)
});

export const addSignatures = (
  props: PrepareTransfersProps
): PrepareTransfersProps => {
  const { transactions, inputs, seed } = props;
  const normalizedBundle = normalizedBundleHash(transactions[0].bundle);

  return {
    ...props,
    transactions: addHBytes(
      transactions,
      inputs.reduce((acc: ReadonlyArray<HBytes>, { keyIndex, security }) => {
        const keyHBytes = key(
          subseed(hbits(seed), keyIndex),
          security || SECURITY_LEVEL
        );
        const publicNonces = computePublicNonces(keyHBytes, normalizedBundle);
        return Array(1) //security
          .fill(null)
          .map((_, i) =>
            hex(signatureFragment(normalizedBundle, keyHBytes, publicNonces))
          );
        // return acc.concat(
        //   Array(security)
        //     .fill(null)
        //     .map((_, i) =>
        //       hbytes(
        //         signatureFragment(
        //           normalizedBundle.slice(
        //             i * HASH_LENGTH / 3,
        //             (i + 1) * HASH_LENGTH / 3
        //           ),
        //           keyHBits.slice(
        //             i * KEY_FRAGMENT_LENGTH,
        //             (i + 1) * KEY_FRAGMENT_LENGTH
        //           )
        //         )
        //       )
        //     )
        // );
      }, []),
      transactions.findIndex(({ value }) => value < 0)
    )
  };
};

export const addHMAC = (
  props: PrepareTransfersProps
): PrepareTransfersProps => {
  const { hmacKey, transactions } = props;

  return hmacKey
    ? { ...props, transactions: HMAC(transactions, hbits(hmacKey)) }
    : props;
};

export const asTransactionHBytes = (
  props: PrepareTransfersProps
): PrepareTransfersProps => ({
  ...props,
  hbytes: asFinalTransactionHBytes(props.transactions)
});
