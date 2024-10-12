type Point = [number, number]
type DoublePointLine = [Point, Point];
type Hailstone = {
  pos: [number, number, number];
  vec: [number, number, number];
};
type Input = {
	lines: Array<Hailstone>;
	min?: number,
	max?: number;
};

export const solutions: Array<
  (input: Input, run?: boolean) => number | string
> = [];
export const parseInput = (rawInut: string, min?: number, max?: number): Input => {
  const lines = rawInut.split(/\r?\n/g);
  return {
		lines: lines.map((line) => {
			const [_pos, _vel] = line.split(" @ ");
			const [px, py, pz] = _pos.split(", ");
			const [vx, vy, vz] = _vel.split(", ");
	
			return {
				pos: [+px, +py, +pz],
				vec: [+vx, +vy, +vz],
			};
		}),
		min,
		max,
	}
};

const simpleIntersectionFinder = (
  lineA: DoublePointLine,
  lineB: DoublePointLine,
) => {
	const denominator = (lineB[1][1] - lineB[0][1]) * (lineA[1][0] - lineA[0][0]) - (lineB[1][0] - lineB[0][0]) * (lineA[1][1] - lineA[0][1]);
  // Check if the lines are parallel (denominator = 0)
  if (denominator == 0) {
    return null; // No intersection
  }
  
  // Calculate ua and ub
  const ua = ((lineB[1][0] - lineB[0][0]) * (lineA[0][1] - lineB[0][1]) - (lineB[1][1] - lineB[0][1]) * (lineA[0][0] - lineB[0][0])) / denominator;
  const ub = ((lineA[1][0] - lineA[0][0]) * (lineA[0][1] - lineB[0][1]) - (lineA[1][1] - lineA[0][1]) * (lineA[0][0] - lineB[0][0])) / denominator;
  
  // Calculate intersection point
  const intersectionX = lineA[0][0] + ua * (lineA[1][0] - lineA[0][0]);
  const intersectionY = lineA[0][1] + ua * (lineA[1][1] - lineA[0][1]);
  
  // Check if the intersection point is within the segments
  const isInside = ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  
  // Determine the ternary position (-1, 0, 1)
  const position = ua < 0 ? -1 : ua > 1 ? 1 : 0;
  
  // Return the result object
  return {
    x: intersectionX,
    y: intersectionY,
    isInside: isInside,
    position: position,
  };
};

const simpleLineLimiter = (
  hailstone: Hailstone,
  min: number,
  max: number,
): null | DoublePointLine => {

	const pointA: Point = [hailstone.pos[0], hailstone.pos[1],]
	const pointB: Point = [hailstone.pos[0] + hailstone.vec[0], hailstone.pos[1] + hailstone.vec[1]];
	const line: DoublePointLine = [pointA, pointB];

	const intersections: Array<ReturnType<typeof simpleIntersectionFinder>> = [];
	intersections.push(simpleIntersectionFinder(line, [[min, Number.MAX_SAFE_INTEGER], [min, -Number.MAX_SAFE_INTEGER]]));
	intersections.push(simpleIntersectionFinder(line, [[max, Number.MAX_SAFE_INTEGER], [max, -Number.MAX_SAFE_INTEGER]]));
	intersections.push(simpleIntersectionFinder(line, [[Number.MAX_SAFE_INTEGER, min], [-Number.MAX_SAFE_INTEGER, min]]));
	intersections.push(simpleIntersectionFinder(line, [[Number.MAX_SAFE_INTEGER, max], [-Number.MAX_SAFE_INTEGER, max]]));

	const filteredIntersections = intersections.filter((intersection) => {
		if (!intersection) return false;
		return intersection.x >= min && intersection.x <= max && intersection.y >= min && intersection.y <= max;
	}).filter((e) => e !== null) as Array<Exclude<ReturnType<typeof simpleIntersectionFinder>, null>>;

	if (filteredIntersections.length !== 2) return null;
	return filteredIntersections.map((intersection) => {
		if (intersection.position === 1) {
			return [
				intersection.x,
				intersection.y,
			];
		}

		return pointA;
	}) as DoublePointLine;
};

solutions[0] = (input: Input, run = false): number => {
  if (!run) return -1;

	const min = input.min ?? 200000000000000;
	const max = input.max ?? 400000000000000;

  let n = 0;
  const limitedLines = input.lines.map((hailstone) =>
    simpleLineLimiter(hailstone, min, max)
  ).filter(e => e !== null) as Array<DoublePointLine>;

  for (let i = 0; i < limitedLines.length; i++) {
    for (let j = i + 1; j < limitedLines.length; j++) {
      const res = simpleIntersectionFinder(limitedLines[i], limitedLines[j]);
			if (res && res.isInside) n++;
    }
  }

  return n;
};

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
};

const example = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

console.log(solutions[0](parseInput(example, 7, 27), true));
