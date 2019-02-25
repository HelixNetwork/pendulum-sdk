/** @module unit-converter */
import BigNumber from "bignumber.js";

export enum Unit {
  h = "h",
  Kh = "Kh",
  Mh = "Mh",
  Gh = "Gh",
  Th = "Th",
  Ph = "Ph"
}

export interface UnitMap {
  readonly [unit: string]: {
    readonly val: BigNumber;
    readonly dp: number;
  };
}

// Map of Helix Units based off of the standard System of Units
export const unitMap: UnitMap = {
  h: { val: new BigNumber(10).pow(0), dp: 0 },
  Kh: { val: new BigNumber(10).pow(3), dp: 3 },
  Mh: { val: new BigNumber(10).pow(6), dp: 6 },
  Gh: { val: new BigNumber(10).pow(9), dp: 9 },
  Th: { val: new BigNumber(10).pow(12), dp: 12 },
  Ph: { val: new BigNumber(10).pow(15), dp: 15 } // For the very, very rich
};

/**
 * Converts accross Helix units. Valid unit names are:
 * `h`, `Kh`, `Mh`, `Gh`, `Th`, `Ph`
 *
 * @method convertUnits
 *
 * @param {string | int | float} value
 *
 * @param {string} fromUnit - Name of original value unit
 *
 * @param {string} toUnit - Name of unit wich we convert to
 *
 * @return {Number}
 */
export const convertUnits = (
  value: string | number,
  fromUnit: Unit,
  toUnit: Unit
) => {
  // Check if wrong unit provided
  if (!unitMap[fromUnit] || !unitMap[toUnit]) {
    throw new Error("Invalid unit provided.");
  }

  const valueBn = new BigNumber(value);

  if (valueBn.dp() > unitMap[fromUnit].dp) {
    throw new Error("Input value exceeded max fromUnit precision.");
  }

  return valueBn
    .times(unitMap[fromUnit].val)
    .dividedBy(unitMap[toUnit].val)
    .toNumber();
};
