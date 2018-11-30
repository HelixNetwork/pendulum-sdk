import test from "ava";
import { isTransferArray } from "../src";

test("isTransferArray() returns true for valid transfer.", t => {
  const transfers = [
    {
      address:
        "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
      value: 1234,
      message: "abcd",
      tag: "abcdef"
    }
  ];

  t.is(
    isTransferArray(transfers),
    true,
    "isTransferArray() should return true for valid transfer."
  );
});

test("isTransferArray() returns false for transfer with invalid address.", t => {
  const transfers = [
    {
      address:
        "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db2",
      value: 1234,
      message: "abcd",
      tag: "abcdef"
    }
  ];

  t.is(
    isTransferArray(transfers),
    false,
    "isTransferArray() should return false for transfer with invalid address."
  );
});

test("isTransferArray() returns false for transfer with invalid value.", t => {
  const transfers = [
    {
      address:
        "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
      value: -10,
      message: "abcd",
      tag: "abcdef"
    }
  ];

  t.is(
    isTransferArray(transfers),
    false,
    "isTransferArray() should return false for transfer with invalid value."
  );
});

test("isTransferArray() returns false for message of invalid bytes.", t => {
  const transfers = [
    {
      address:
        "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
      value: 1234,
      message: "abcdg",
      tag: "abcdef"
    }
  ];

  t.is(
    isTransferArray(transfers),
    false,
    "isTransferArray() should return false for message of invalid bytes."
  );
});

test("isTransferArray() returns false for tag of invalid length.", t => {
  const transfers = [
    {
      address:
        "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
      value: 1234,
      message: "abcd",
      tag: "abcdefabcdefabcdefabcdefabcdef"
    }
  ];

  t.is(
    isTransferArray(transfers),
    false,
    "isTransferArray() should return false for tag of invalid length."
  );
});

test("isTransferArray() returns false for tag of invalid bytes.", t => {
  const transfers = [
    {
      address:
        "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db",
      value: 1234,
      message: "abcd",
      tag: "abcdEF"
    }
  ];

  t.is(
    isTransferArray(transfers),
    false,
    "isTransferArray() should return false for tag of invalid bytes."
  );
});
