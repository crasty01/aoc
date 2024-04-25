import { FloydWarshall } from "npm:floyd-warshall-shortest@1.0.2";

type Input = {
  flows: Map<string, number>;
  nonezero: Set<string>;
  graph: FloydWarshall;
}

const parseLine = (line: string) => {
  const res =
    /Valve (?<valve>[A-Z]{2}) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<targets>([A-Z]{2}(, )?)+)/
      .exec(line)?.groups!;
  return {
    valve: res.valve,
    flow: parseInt(res.flow, 10),
    targets: res.targets.split(", "),
  };
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const flows = new Map<string, number>();
  const tunnels = new Map<string, string[]>();
  const nonezero = new Set<string>();

  const edges = rawInut.split("\r\n").map((line) => {
    const { valve, flow, targets } = parseLine(line);

    flows.set(valve, flow);
    tunnels.set(valve, targets);
    if (flow > 0) nonezero.add(valve);

    return targets.map((to) => ({ from: valve, to, weight: 1 }));
  }).flat();

  const graph = new FloydWarshall(edges, false);
  return { flows, nonezero, graph };
};

const solution = (
  { flows, nonezero, graph }: Input
): (time: number, valve: string, bitmask: number) => number => {
  const indices = new Map<string, number>([...nonezero.entries()].map(([value], index) => [value, index]));
  const cache = new Map<string, number>();
  const getCacheKey = (time: number, valve: string, bitmask: number) => `${time}-${valve}-${bitmask}`;
  const allButCurrent = (valves: Array<string>, currentValve: string) => valves.filter((valve) => valve !== currentValve);

  const dfs = (time: number, valve: string, bitmask: number): number => {
    const key = getCacheKey(time, valve, bitmask);
    if (cache.has(key)) return cache.get(key)!;
    
    let maxval = 0;
    const neighbors = allButCurrent([...nonezero], valve);

    for (const neighbor of neighbors) {
      const bit = 1 << indices.get(neighbor)!;
      if (bitmask & bit) continue;

      const timeRemaining = time - graph.getShortestDistance(valve, neighbor) - 1;
      if (timeRemaining <= 0) continue;

      maxval = Math.max(maxval, dfs(timeRemaining, neighbor, bitmask | bit) + flows.get(neighbor)! * timeRemaining);
    }

    cache.set(key, maxval);
    return maxval;
  };

  return dfs;
};

solutions[0] = (input: Input): number | string => {
  const START_TIME = 30;
  const START_VALVE = "AA";

  const dfs = solution(input);

  return dfs(START_TIME, START_VALVE, 0);
};

solutions[1] = (input: Input): number | string => {
  const START_TIME = 26;
  const START_VALVE = "AA";

  const dfs = solution(input);

  const b = (1 << input.nonezero.size) - 1;
  let max = 0;

  for (let i = 0; i < b; i++) {
    max = Math.max(max, dfs(START_TIME, START_VALVE, i) + dfs(START_TIME, START_VALVE, b ^ i));
  }

  return max;
};

const exampleInput =
  `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\r\nValve BB has flow rate=13; tunnels lead to valves CC, AA\r\nValve CC has flow rate=2; tunnels lead to valves DD, BB\r\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\r\nValve EE has flow rate=3; tunnels lead to valves FF, DD\r\nValve FF has flow rate=0; tunnels lead to valves EE, GG\r\nValve GG has flow rate=0; tunnels lead to valves FF, HH\r\nValve HH has flow rate=22; tunnel leads to valve GG\r\nValve II has flow rate=0; tunnels lead to valves AA, JJ\r\nValve JJ has flow rate=21; tunnel leads to valve II`;
// console.log(solutions[0](parseInput(exampleInput), true));
// console.log(solutions[1](parseInput(exampleInput), true));
