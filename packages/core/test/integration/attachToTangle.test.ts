import { createHttpClient } from "@helixnetwork/http-client";
import test from "ava";
import {
  INVALID_BRANCH_TRANSACTION,
  INVALID_TRANSACTION_HBYTES,
  INVALID_TRUNK_TRANSACTION
} from "../../../errors";
import { createAttachToTangle } from "../../src";
import {
  attachToTangleCommand,
  attachToTangleResponse
} from "./nocks/attachToTangle";

const attachToTangle = createAttachToTangle(createHttpClient());

test("attachToTangle() resolves to correct balances response", async t => {
  t.deepEqual(
    await attachToTangle(
      attachToTangleCommand.trunkTransaction,
      attachToTangleCommand.branchTransaction,
      attachToTangleCommand.minWeightMagnitude,
      [...attachToTangleCommand.tx]
    ),
    attachToTangleResponse.tx,
    "attachToTangle() should resolve to correct balances"
  );
});

test("attachToTangle() does not mutate original tx", async t => {
  const tx = [...attachToTangleCommand.tx];

  await attachToTangle(
    attachToTangleCommand.trunkTransaction,
    attachToTangleCommand.branchTransaction,
    attachToTangleCommand.minWeightMagnitude,
    tx
  );

  t.deepEqual(
    tx,
    attachToTangleCommand.tx,
    "attachToTangle() should not mutate original tx"
  );
});

test("attachToTangle() rejects with correct errors for invalid input", t => {
  const invalidHBytes = ["asdasDSFDAFD"];

  t.is(
    t.throws(
      () =>
        attachToTangle(
          invalidHBytes[0],
          attachToTangleCommand.branchTransaction,
          attachToTangleCommand.minWeightMagnitude,
          attachToTangleCommand.tx
        ),
      Error
    ).message,
    `${INVALID_TRUNK_TRANSACTION}: ${invalidHBytes[0]}`,
    "attachToTangle() should throw error for invalid trunk transaction"
  );

  t.is(
    t.throws(
      () =>
        attachToTangle(
          attachToTangleCommand.trunkTransaction,
          invalidHBytes[0],
          attachToTangleCommand.minWeightMagnitude,
          attachToTangleCommand.tx
        ),
      Error
    ).message,
    `${INVALID_BRANCH_TRANSACTION}: ${invalidHBytes[0]}`,
    "attachToTangle() should throw error for invalid branch transaction"
  );

  t.is(
    t.throws(
      () =>
        attachToTangle(
          attachToTangleCommand.trunkTransaction,
          attachToTangleCommand.branchTransaction,
          attachToTangleCommand.minWeightMagnitude,
          invalidHBytes
        ),
      Error
    ).message,
    `${INVALID_TRANSACTION_HBYTES}: ${invalidHBytes[0]}`,
    "attachToTangle() should throw error for invalid tx"
  );
});

test.cb("attachToTangle() invokes callback", t => {
  attachToTangle(
    attachToTangleCommand.trunkTransaction,
    attachToTangleCommand.branchTransaction,
    attachToTangleCommand.minWeightMagnitude,
    attachToTangleCommand.tx,
    t.end
  );
});

test.cb("attachToTangle() passes correct arguments to callback", t => {
  attachToTangle(
    attachToTangleCommand.trunkTransaction,
    attachToTangleCommand.branchTransaction,
    attachToTangleCommand.minWeightMagnitude,
    attachToTangleCommand.tx,
    (err, res) => {
      t.is(
        err,
        null,
        "attachToTangle() should pass null as first argument in callback for successuful requests"
      );

      t.deepEqual(
        res,
        attachToTangleResponse.tx,
        "attachToTangle() should pass the correct response as second argument in callback"
      );

      t.end();
    }
  );
});
