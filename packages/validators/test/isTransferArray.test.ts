import test from "ava";
import { isTransferArray } from "../src";

test("isTransferArray() returns true for valid transfer.", t => {
  const transfers = [
    {
      address:
        "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
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
        "uic1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
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
        "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
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
        "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
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
        "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
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
        "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
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
