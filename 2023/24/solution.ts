type DoublePointLine = [number, number, number, number];
type Hailstone = {
	px: number,
	py: number,
	pz: number,
	vx: number,
	vy: number,
	vz: number,
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
				px: parseInt(px),
				py: parseInt(py),
				pz: parseInt(pz),
				vx: parseInt(vx),
				vy: parseInt(vy),
				vz: parseInt(vz),
			};
		}),
		min,
		max,
	}
};

const getLinesIntersection = (
	h1: Hailstone,
	h2: Hailstone,
) => {
  const [x1, x2, y1, y2] = [h1.px, h1.px+100000000000000*h1.vx, h1.py, h1.py+100000000000000*h1.vy];
  const [x3, x4, y3, y4] = [h2.px, h2.px+100000000000000*h2.vx, h2.py, h2.py+100000000000000*h2.vy];

  const denominator = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
  if (denominator === 0) {
    return false;
  }

  const x = ((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) / denominator;
  const y = ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) / denominator;

  return { x, y };
}

const det = (m: Array<Array<number>>): number => {
  if (m.length === 0) return 1;
  const [l, ...r] = m;
  const result = l.map((n, i) => n * det(r.map(row => row.toSpliced(i, 1))));
  return result.reduce((a, b, i) => (i % 2 ? a - b : a + b), 0);
}

solutions[0] = (input: Input): number => {
	const min = input.min ?? 200000000000000;
	const max = input.max ?? 400000000000000;

  let n = 0;

  for (let i = 0; i < input.lines.length; i++) {
    for (let j = i + 1; j < input.lines.length; j++) {
			const h1 = input.lines[i]
			const h2 = input.lines[j]
      const intersection = getLinesIntersection(h1, h2);
			if (false
				|| !intersection
				|| intersection.x < min
				|| intersection.x > max
				|| intersection.y < min
				|| intersection.y > max
			) {
        continue;
      }

      const h1Time = (intersection.x - h1.px) / h1.vx
      const h2Time = (intersection.x - h2.px) / h2.vx;
			
			if (h1Time < 0 || h2Time < 0) {
				continue;
			}

			n += 1;
    }
  }

  return n;
};

// Cramer's rule solution
// taken from: https://www.reddit.com/r/adventofcode/comments/18pnycy/2023_day_24_solutions/khlrstp/
solutions[1] = (input: Input): number => {
	const A: Array<Array<number>> = [];
	const B: Array<number> = [];

  for (let i = 1; i <= 3; i++) {
		const h0 = input.lines[0];
		const hn = input.lines[i];
		A.push([h0.vy - hn.vy, hn.vx - h0.vx, 0, hn.py - h0.py, h0.px - hn.px, 0]);
		B.push(h0.px * h0.vy - h0.py * h0.vx - hn.px * hn.vy + hn.py * hn.vx);
		A.push([h0.vz - hn.vz, 0, hn.vx - h0.vx, hn.pz - h0.pz, 0, h0.px - hn.px]);
		B.push(h0.px * h0.vz - h0.pz * h0.vx - hn.px * hn.vz + hn.pz * hn.vx);
	}

	console.log(A, B)

  const detA = det(A);
  const [pxr, pyr, pzr] = A.map((_, i) => det(A.map((r, j) => r.toSpliced(i, 1, B[j]))) / detA);

  return pxr + pyr + pzr;
};
