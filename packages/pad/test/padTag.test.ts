import test from "ava";
import { padTag, padTagArray } from "../src";

test("padTag() adds correct padding to tag.", t => {
  const tag = "abcd";
  const expected = "abcd" + "0".repeat(12);

  t.is(padTag(tag), expected, "padTag() should add correct padding to tag.");
});

test("padTag() adds no padding to 2 * 8-hbytes long tags.", t => {
  const tag = "aabb".repeat(4);

  t.is(
    padTag(tag),
    tag,
    "padTag() should add no padding to 2 * 8-hbytes long tags."
  );
});

test("padTagArray() adds correct padding to tag array.", t => {
  const tags = ["abcd"];
  const expected = ["abcd" + "0".repeat(12)];

  t.deepEqual(
    padTagArray(tags),
    expected,
    "padTag() should add correct padding to tag array."
  );
});
