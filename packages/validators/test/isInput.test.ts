import test from "ava";
import { isInput } from "../src";

test("isInput()", t => {
  const address =
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f";
  const validInput = {
    address,
    security: 2,
    keyIndex: 0,
    balance: 10
  };

  t.is(isInput(validInput), true, "isInput returns true for valid input");

  t.is(
    isInput({
      address,
      keyIndex: 0,
      balance: 10
    }),
    false,
    "isInput returns false for input without security level"
  );

  t.is(
    isInput({
      address,
      keyIndex: 0,
      security: 2
    }),
    true,
    "isInput returns true for valid input without balance"
  );

  t.is(
    isInput({
      ...validInput,
      address: "dsafas"
    }),
    false,
    "isInput returns false for input with invalid address"
  );

  t.is(
    isInput({
      ...validInput,
      address: undefined
    }),
    false,
    "isInput returns false for input without address"
  );

  t.is(
    isInput({
      ...validInput,
      security: -1.5
    }),
    false,
    "isInput returns false for input with invalid security"
  );

  t.is(
    isInput({
      ...validInput,
      keyIndex: -1
    }),
    false,
    "isInput returns false for input with invalid keyIndex"
  );

  t.is(
    isInput({
      ...validInput,
      keyIndex: undefined
    }),
    false,
    "isInput returns false for input without keyIndex"
  );

  t.is(
    isInput({
      ...validInput,
      balance: -10
    }),
    false,
    "isInput returns false for invalid balance"
  );
});
