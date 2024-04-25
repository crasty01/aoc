type Pos = [number, number];
type Input = Array<[Pos, Pos]>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line) => {
    const { sx, sy, bx, by } = /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/.exec(line)!.groups!;
    return [[parseInt(sx, 10), parseInt(sy, 10)], [parseInt(bx, 10), parseInt(by, 10)]];
  });
}

const getManhattanDistance = (a: Pos, b: Pos) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

const solution = (input: Input, row: number): Array<[number, number]> =>  {
  const lines: Array<[number, number]> = [];

  for (const sensor of input) {
    const [sensorPos, beaconPos] = sensor;
    const distance = getManhattanDistance(sensorPos, beaconPos);
    const length = distance - Math.abs(sensorPos[1] - row);

    // if the beacon is not in range, skip it
    if (length <= 0) continue;

    // insert [sensorPos[0] - length, sensorPos[0] + length] into lines, sorted by first element
    const index = lines.findIndex(([a]) => a > sensorPos[0] - length);
    if (index === -1) lines.push([sensorPos[0] - length, sensorPos[0] + length]);
    else lines.splice(index, 0, [sensorPos[0] - length, sensorPos[0] + length]);
  }

  // combine overlaing lines
  for (let i = 0; i < lines.length - 1; i++) {
    const [a, b] = lines[i];
    const [c, d] = lines[i + 1];
    if (b >= c) {
      lines[i] = [a, Math.max(b, d)];
      lines.splice(i + 1, 1);
      i--;
    }
  }

  return lines;
}

solutions[0] = (input: Input): number | string =>  {
  const ROW = 2000000;

  const beaconsAndSensors = new Set(input.flat(1).filter((pos) => pos[1] === ROW).map((pos) => pos.join(',')));
  const lines = solution(input, ROW).sort((a, b) => a[0] - b[0]);

  let sum = 0;
  for (const [a, b] of lines) {
    sum += b - a + 1;
  }

  return sum - beaconsAndSensors.size;
}

solutions[1] = (input: Input, MIN = 0, MAX = 4_000_000): number | string =>  {
  const spots = new Set<string>();

  for (let row = MIN; row <= MAX; row++) {
    const lines = solution(input, row);
    
    if (lines.length > 1) {
      for (let i = 0; i < lines.length - 1; i++) {
        const [_a, b] = lines[i];
        const [c, _d] = lines[i + 1];
        if (b < c - 1) spots.add(`${b + 1},${row}`);
      }
    }
  }
  
  if (spots.size !== 1) throw new Error('More than one or none spots found');

  const [spotX, spotY] = [...spots][0].split(',').map((n: string) => parseInt(n, 10)) as Pos;

  return (spotX * 4_000_000) + spotY;
}