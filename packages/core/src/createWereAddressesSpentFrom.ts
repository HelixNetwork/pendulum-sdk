import { removeChecksum } from "@helixnetwork/checksum";
import * as Promise from "bluebird";
import * as errors from "../../errors";
import { addressValidator, arrayValidator, validate } from "../../guards";
import {
  BaseCommand,
  Callback,
  Hash,
  ProtocolCommand,
  Provider
} from "../../types";

export interface WereAddressesSpentFromCommand extends BaseCommand {
  command: string;
  readonly addresses: ReadonlyArray<Hash>;
}

export interface WereAddressesSpentFromResponse {
  readonly states: ReadonlyArray<boolean>;
}

export const createWereAddressesSpentFrom = (
  { send }: Provider,
  caller?: string
) => (
  addresses: ReadonlyArray<Hash>,
  callback?: Callback<ReadonlyArray<boolean>>
): Promise<ReadonlyArray<boolean>> => {
  if (caller !== "lib") {
    /* tslint:disable-next-line:no-console */
    console.warn(
      "Avoid using `wereAddressesSpentFrom()` instead of proper input management with a local database.\n" +
        "`wereAddressesSpentFrom()` does not scale in IoT environment, hence it will be removed from the " +
        "library in a future version."
    );
  }

  return Promise.resolve(
    validate(
      arrayValidator(addressValidator)(addresses, errors.INVALID_ADDRESS)
    )
  )
    .then(() =>
      send<WereAddressesSpentFromCommand, WereAddressesSpentFromResponse>({
        command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
        addresses: removeChecksum(addresses)
      })
    )
    .then(res => res.states)
    .asCallback(callback);
};
