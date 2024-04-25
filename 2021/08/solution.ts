import { assertEquals } from "std/testing/asserts.ts";
import { permutations } from "combinatorics/mod.ts";

type Input = Array<Signal>;
type Signal = {
  left: Array<string>;
  right: Array<string>;
};

const createMap = (
  input: Array<string>,
  output: Array<string>,
): Map<string, string> => {
  if (input.length !== output.length) {
    throw new Error(
      "Input and output does not have the same length. Unable to create Map.",
    );
  }
  const map = new Map();
  for (let i = 0; i < input.length; i++) {
    map.set(input[i], output[i]);
  }
  return map;
};
const decode = (
  input: Array<string>,
  map: Map<string, string>,
): Array<string> => {
  return input.join(" ")
    .replace(/\w/g, (e) => (map.has(e) ? map.get(e) : e)!)
    .split(" ").map((e) => [...e].sort((a, b) => a.localeCompare(b)).join(""));
  // .sort((a, b) => a.length - b.length || a.localeCompare(b)) // messses up the numbers (8394 => 4398)
};
const toNumber = new Map([
  ["cf", 1],
  ["acf", 7],
  ["bcdf", 4],
  ["abdfg", 5],
  ["acdeg", 2],
  ["acdfg", 3],
  ["abcdfg", 9],
  ["abcefg", 0],
  ["abdefg", 6],
  ["abcdefg", 8],
]);
const correct = [...toNumber.keys()]
  .map((e) => [...e].sort((a, b) => a.localeCompare(b)).join(""))
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split("\r\n").map((e) => {
    const [left, right] = e.split(" | ").map((f) => f.split(" "));
    return { left, right };
  });
};

solutions[0] = (input: Input): number | string => {
  // return 0; // TODO: does not work!
  return input.reduce(
    (acc, e) =>
      acc + e.right.filter(
        (f) => [2, 3, 4, 7].includes(f.length),
      ).length,
    0,
  );
};

solutions[1] = (input: Input): number | string => {
  // return 0; 
  const list = ["a", "b", "c", "d", "e", "f", "g"];
  let sum = 0;

  for (const line of input) {
    const perm = permutations(list);
    for (const element of perm) {
      if (!element) continue;
      try {
        const m = createMap(list, element);
        const decoded_left = decode(line.left, m).sort((a, b) =>
          a.length - b.length || a.localeCompare(b)
        );
        assertEquals(decoded_left, correct, "not correct input");
        const result = +decode(line.right, m).map((e) => toNumber.get(e)).join(
          "",
        );
        sum += result;
      } catch (error) {
        continue;
      }
    }
  }

  return sum;
};
