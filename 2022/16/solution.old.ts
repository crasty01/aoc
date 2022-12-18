import { FloydWarshall, Edge } from "floyd-warshall-shortest";

type Valve = {
  name: string;
  flowRate: number;
  connections: Array<string>;
};
type Input = [Set<string>, Map<string, Valve>, FloydWarshall];

export const parseInput = (rawInut: string): Input => {
  const usefulValves = new Set<string>();
  const valves = rawInut.split("\r\n").map((line) => {
    const groups =
      /Valve (?<valve>[A-Z]{2}) has flow rate=(?<flowRate>\d+); tunnels? leads? to valves? (?<connections>([A-Z]{2}(, )?)+)/
        .exec(line)?.groups!;
    const connection = {
      name: groups.valve,
      flowRate: parseInt(groups.flowRate),
      connections: groups.connections.split(", "),
    }
    if (connection.flowRate > 0) usefulValves.add(connection.name);
    return connection;
  });

  const edges: Array<Edge<string>> = [];
  for (const line of valves) {
    for (const connection of line.connections) {
      edges.push({
        from: line.name,
        to: connection,
        weight: 1,
      });
    }
  }

  const graph = new FloydWarshall(edges, false);

  return [
    usefulValves,
    new Map(valves.map((valve) => [valve.name, valve])),
    graph,
  ];
};

export const solution1 = ([usefulValves, valves, graph]: Input): number | string => {
  const START_VALVE = 'AA';
  const START_TIME = 30;
  const MAX_ITERATIONS = 100000000;

  let maxFlowSum = 0;
  const ended = [] as Array<any>;
  let iteration = 0;

  const queue = [{
    valveName: START_VALVE,
    time: START_TIME,
    flowSum: 0,
    openValves: new Set<string>(),
    log: [] as Array<any>,
  }];

  while (queue.length > 0 && ++iteration < MAX_ITERATIONS) {
    queue.sort((a, b) => (b.flowSum - a.flowSum) * 1000 + (b.time - a.time) * 100 + (b.openValves.size - a.openValves.size) * 10 + (b.valveName > a.valveName ? 1 : -1));

    const position = queue.shift()!;
    const { valveName, time, flowSum, openValves, log } = position;
    let possibilities = 0;
    
    const usefulClosedValves = [...usefulValves].filter((usefulValve) => !openValves.has(usefulValve));
    for (const connection of usefulClosedValves) {
      const flowRateCombined = [...openValves].reduce((sum, openValve) => sum + valves.get(openValve)!.flowRate, 0);
      const timeChange = graph.getShortestDistance(valveName, connection) + 1;
      const newTime = time - timeChange;
      const newFlowSum = flowSum + flowRateCombined * timeChange;
      const newOpenValves = new Set([...openValves, connection]);

      if (newTime > 0) {
        possibilities += 1;
        queue.push({ valveName: connection, time: newTime, flowSum: newFlowSum, openValves: newOpenValves, log: [...log, {
          flowRate: flowRateCombined,
          timechange: timeChange,
          path: `${valveName} => ${connection}`,
          flowSum: newFlowSum,
        }] });
      }
    }
    
    if (possibilities === 0 || time <= 0) {
      const flowRateCombined = [...openValves].reduce((sum, openValve) => sum + valves.get(openValve)!.flowRate, 0);
      const newFlowSum = flowSum + flowRateCombined * time;
      if (newFlowSum > maxFlowSum) {
        maxFlowSum = newFlowSum;
        ended.push([ ...log, {
          flowRate: flowRateCombined,
          timechange: time,
          path: `${valveName} => END`,
          flowSum: newFlowSum,
        }]);
      }
    }
  }

  // console.table(ended.find((path) => path.at(-1).flowSum === maxFlowSum));

  return maxFlowSum;
};

export const solution2 = ([usefulValves, valves, graph]: Input, run = false): number | string => {
  if (!run) return -1;

  const START_VALVE = 'AA';
  const START_TIME = 26;
  const MAX_ITERATIONS = 100000000;

  let maxFlowSum = 0;
  const ended = [] as Array<any>;
  let iteration = 0;

  const queue = [{
    valveName: START_VALVE,
    time: START_TIME,
    flowSum: 0,
    openValves: new Set<string>(),
    log: [] as Array<any>,
  }];

  while (queue.length > 0 && ++iteration < MAX_ITERATIONS) {
    queue.sort((a, b) => (b.flowSum - a.flowSum) * 1000 + (b.time - a.time) * 100 + (b.openValves.size - a.openValves.size) * 10 + (b.valveName > a.valveName ? 1 : -1));

    const position = queue.shift()!;
    const { valveName, time, flowSum, openValves, log } = position;
    let possibilities = 0;
    
    const usefulClosedValves = [...usefulValves].filter((usefulValve) => !openValves.has(usefulValve));
    for (const connection of usefulClosedValves) {
      const flowRateCombined = [...openValves].reduce((sum, openValve) => sum + valves.get(openValve)!.flowRate, 0);
      const timeChange = graph.getShortestDistance(valveName, connection) + 1;
      const newTime = time - timeChange;
      const newFlowSum = flowSum + flowRateCombined * timeChange;
      const newOpenValves = new Set([...openValves, connection]);

      if (newTime > 0) {
        possibilities += 1;
        queue.push({ valveName: connection, time: newTime, flowSum: newFlowSum, openValves: newOpenValves, log: [...log, {
          flowRate: flowRateCombined,
          timechange: timeChange,
          path: `${valveName} => ${connection}`,
          flowSum: newFlowSum,
        }] });
      }
    }
    
    if (possibilities === 0 || time <= 0) {
      const flowRateCombined = [...openValves].reduce((sum, openValve) => sum + valves.get(openValve)!.flowRate, 0);
      const newFlowSum = flowSum + flowRateCombined * time;
      if (newFlowSum > maxFlowSum) {
        maxFlowSum = newFlowSum;
        ended.push([ ...log, {
          flowRate: flowRateCombined,
          timechange: time,
          path: `${valveName} => END`,
          flowSum: newFlowSum,
        }]);
      }
    }
  }

  console.table(ended.find((path) => path.at(-1).flowSum === maxFlowSum));

  return maxFlowSum;
};

const exampleInput =
  `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\r\nValve BB has flow rate=13; tunnels lead to valves CC, AA\r\nValve CC has flow rate=2; tunnels lead to valves DD, BB\r\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\r\nValve EE has flow rate=3; tunnels lead to valves FF, DD\r\nValve FF has flow rate=0; tunnels lead to valves EE, GG\r\nValve GG has flow rate=0; tunnels lead to valves FF, HH\r\nValve HH has flow rate=22; tunnel leads to valve GG\r\nValve II has flow rate=0; tunnels lead to valves AA, JJ\r\nValve JJ has flow rate=21; tunnel leads to valve II`;
// console.log(solution1(parseInput(exampleInput), true));
console.log(solution2(parseInput(exampleInput), true));
