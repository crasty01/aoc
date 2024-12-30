import { median as calculateMedian } from "ramda/mod.ts";

type Input = Array<number>;

const getPos = (array: Array<number>): [number, number] => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum = sum + array[i];
  }
  return [Math.floor(sum / array.length), Math.ceil(sum / array.length)];
}

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(',').map(Number);
}

solutions[0] = (input: Input): number | string => {
  const median = calculateMedian(input);
  let fuelCost = 0;
  for (const crab of input) {
    fuelCost = fuelCost + Math.abs(crab - median);
  }
  return fuelCost;
}

solutions[1] = (input: Input): number | string => {
  const [floor, ceil] = getPos(input);
  const fuelCost = {
    floor: 0,
    ceil: 0,
  };
  for (const crab of input) {
    const n = Math.abs(crab - floor);
    const a = 1 + n;
    const S = (a / 2) * n;
    fuelCost.floor = fuelCost.floor + S;
  }
  for (const crab of input) {
    const n = Math.abs(crab - ceil);
    const a = 1 + n;
    const S = (a / 2) * n;
    fuelCost.ceil = fuelCost.ceil + S;
  }
  return Math.min(fuelCost.floor, fuelCost.ceil);
}