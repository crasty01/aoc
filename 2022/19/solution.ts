type Input = any;

export const parseInput = (rawInut: string): Input => {
  return rawInut;
}

export const solution1 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

export const solution2 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

const example = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.\r\nBlueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;
console.log(`Example solution 1: ${solution1(parseInput(example), true)}`);
// console.log(`Example solution 2: ${solution2(parseInput(example), true)}`);