import test from "ava";
import { isTransfer } from "../src";

test("isTransfer() returns true for valid transfer.", t => {
  const transfer = {
    address: "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f",
    value: 1234,
    message: "abcd",
    tag: "abcdef"
  };

  t.is(
    isTransfer(transfer),
    true,
    "isTransfer() should return true for valid transfer."
  );

  t.is(
    isTransfer({
      ...transfer,
      message: undefined,
      tag: undefined
    }),
    true,
    "isTransfer() should return true for valid transfer with undefined optional fields."
  );

  t.is(
    isTransfer({
      ...transfer,
      message: "",
      tag: ""
    }),
    true,
    "isTransfer() should return true for valid transfer with empty optional fields."
  );
});

test("isTransfer() returns false for transfer with invalid address.", t => {
  const transfer = {
    address:
      "0116dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f4",
    value: 1234,
    message: "abcd",
    tag: "abcdef"
  };

  t.is(
    isTransfer(transfer),
    false,
    "isTransfer() should return false for transfer with invalid address."
  );
});

test("isTransfer() returns false for transfer with invalid value.", t => {
  const transfer = {
    address: "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f",
    value: -10,
    message: "abcd",
    tag: "abcdef"
  };

  t.is(
    isTransfer(transfer),
    false,
    "isTransfer() should return false for transfer with invalid value."
  );
});

test("isTransfer() returns false for message of invalid txHex.", t => {
  const transfer = {
    address: "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f",
    value: 1234,
    message: "abcdA",
    tag: "abcdef"
  };

  t.is(
    isTransfer(transfer),
    false,
    "isTransfer() should return false for message of invalid txHex."
  );
});

test("isTransfer() returns false for tag of invalid length.", t => {
  const transfer = {
    address: "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f",
    value: 1234,
    message: "abcd",
    tag: "abcdefabcdefabcdefabcdefabcdefabcdefabcdef"
  };

  t.is(
    isTransfer(transfer),
    false,
    "isTransfer() should return false for tag of invalid length."
  );
});

test("isTransfer() returns false for tag of invalid txHex.", t => {
  const transfer = {
    address: "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f",
    value: 1234,
    message: "abcd",
    tag: "abcdefGA"
  };

  t.is(
    isTransfer(transfer),
    false,
    "isTransfer() should return false for tag of invalid txHex."
  );
});
