type Input = Array<Array<[number, number]>>;

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map((line) => {
    return line.split(' -> ').map((coord) => 
      coord.split(',').map((c) => parseInt(c, 10)) as [number, number]
    );
  });
}

const getRocksAndLimit = (input: Input): [number, Set<string>] => {
  const rocks = new Set<string>();
  let lowestLevel = 0;

  for (const line of input) {
    for (let i = 1; i < line.length; i++) {
      let [x1, y1] = line[i - 1];
      let [x2, y2] = line[i];
      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];
      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          rocks.add(`${x},${y}`);
          if (lowestLevel < y) lowestLevel = y;
        }
      }
    }
  }

  return [lowestLevel, rocks];
}


const makeItRain = (
  start: readonly [number, number],
  rocks: Set<string>,
  lowestLevel: number,
  toReturn: (x: number, y: number) => string | null
): string | null => {
  let [x, y] = start;
  
  while (y < lowestLevel) {
    y += 1;
    if (!rocks.has(`${x},${y}`)) {
      continue;
    }
    if (!rocks.has(`${x - 1},${y}`)) {
      x -= 1;
      continue;
    }
    if (!rocks.has(`${x + 1},${y}`)) {
      x += 1;
      continue;
    }

    return `${x},${y - 1}`;
  }

  return toReturn(x, y);
}

export const solution1 = (input: Input): number | string =>  {
  const START = [500, 0] as const;
  const MAX_ITERATIONS = 10000;

  const [lowestLevel, rocks] = getRocksAndLimit(input);
  let iterations = 0;

  const beforeStart = rocks.size;

  do {
    const newRock = makeItRain(START, rocks, lowestLevel, () => null);
    if (newRock === null) break;
    rocks.add(newRock);
  } while (iterations++ < MAX_ITERATIONS);

  return rocks.size - beforeStart;
}

export const solution2 = (input: Input): number | string =>  {
  const START = [500, 0] as const;
  const MAX_ITERATIONS = 10000000; // just to have some limit... it's not needed

  let iterations = 0;
  const [_lowestLevel, rocks] = getRocksAndLimit(input);
  const lowestLevel = _lowestLevel + 1;


  const beforeStart = rocks.size;

  do {
    const newRock = makeItRain(
      START,
      rocks,
      lowestLevel,
      (x, y) => `${x},${y}`
    );
    if (newRock === null) break;
    rocks.add(newRock);
    if (newRock === `${START[0]},${START[1]}`) break;
  } while (iterations++ < MAX_ITERATIONS);

  return rocks.size - beforeStart;
}