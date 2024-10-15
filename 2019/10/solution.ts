type Input = {
  asteriods: string;
  height: number;
  width: number;
};

export const solutions: Array<
  (input: Input, run?: boolean) => number | string
> = [];
export const parseInput = (rawInut: string): Input => {
  const height = (rawInut.match(/\r?\n/g)?.length ?? 0) + 1;
  const asteriods = rawInut.replace(/\r?\n/g, "");
  return {
    asteriods,
    height,
    width: asteriods.length / height,
  };
};

const vector2angle = (x: number, y: number) => {
  let angle = Math.atan2(y, x);

  angle = angle * (180 / Math.PI);
  angle = (angle + 90) % 360;

  if (angle < 0) {
    angle += 360;
  }

  return angle;
};

const getDistance2 = (x1: number, y1: number, x2: number, y2: number) => {
  return (Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

type Asteroid = {
	x: number;
	y: number;
	dist2: number;
};
type M = Map<number, Array<Asteroid>>;
const getBestPosition = (input: Input): {
  seen: number;
  map: M;
} => {
	const { asteriods, height, width } = input;
  const seen: M = new Map();
  let mostSeenMap: M = new Map();
  let mostSeen = 0;

  for (let stationY = 0; stationY < height; stationY++) {
    for (let stationX = 0; stationX < width; stationX++) {
      if (asteriods[stationY * width + stationX] === ".") continue;
      seen.clear();

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (stationX == x && stationY === y) continue;
          if (asteriods[y * width + x] === ".") continue;

					const key = +vector2angle(x - stationX, y - stationY).toFixed(3);
					const dist2 = getDistance2(x, y, stationX, stationY);
          if (!seen.has(key)) seen.set(key, []);
          seen.get(key)?.push({ x, y, dist2 })
        }
      }

      if (mostSeen < seen.size) {
        mostSeen = seen.size;
        mostSeenMap = new Map(seen);
      }
    }
  }

  return {
    seen: mostSeen,
    map: mostSeenMap,
  };
};

solutions[0] = (input: Input, run = false): number => {
  const { seen } = getBestPosition(input);
  return seen;
};

solutions[1] = (input: Input, run = false): number => {
  const { map } = getBestPosition(input);

	const sortedByAngle = Array.from(map)
		.sort((a, b) => a[0] - b[0])
		.map(([angle, asteriods]) => [angle, asteriods.sort((aa, bb) => aa.dist2 - bb.dist2)]) as Array<[number, Array<Asteroid>]>;

	let i = 0;
	let removed = 0;
	let notRemoved = 0;
	let last: undefined | Asteroid = undefined;

	while (removed < 200 && notRemoved < sortedByAngle.length) {
		if (sortedByAngle[i][1].length > 0) {
			last = sortedByAngle[i][1].shift();
			removed += 1;
			notRemoved = 0;
		} else {
			notRemoved += 1;
		}
		i = (i + 1) % sortedByAngle.length;
	}

	if (!last) throw new Error("NO ASTEROID FOUND");
	
  return last.x * 100 + last.y;
};