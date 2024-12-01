type Input = Array<{
	x: number;
	y: number;
	z: number;
}>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map(e => {
		const groups = /^<x=(?<x>[\d-]+), y=(?<y>[\d-]+), z=(?<z>[\d-]+)>$/g.exec(e)?.groups;
		if (!groups || !groups.x || !groups.y || !groups.z) throw new Error(`INVALID INPUT: '${e}', goups: ${groups}`);
		
		return {
			x: parseInt(groups.x),
			y: parseInt(groups.y),
			z: parseInt(groups.z),
		}
	});
}

class Moon {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;

		this.vx = 0;
		this.vy = 0;
		this.vz = 0;
	}

	applyGravity(planet: Moon) {
		this.vx += Math.sign(planet.x - this.x);
		this.vy += Math.sign(planet.y - this.y);
		this.vz += Math.sign(planet.z - this.z);

		return this;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.z += this.vz;
	}

	get potential() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	get kinetic() {
		return Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.vz);
	}

	get energy() {
		return this.potential * this.kinetic;
	}

	toString() {
		return `Moon { x: ${this.x}, y: ${this.y}, z: ${this.z}, vx: ${this.vx}, vy: ${this.vy}, vz: ${this.vz} }`
	}
}

const findCycle = (positions: Array<number>) => {
	const velocities = Array.from({ length: positions.length }, () => 0);
	let steps = 0;

	do {
		for (let a = 0; a < positions.length; a++) {
			for (let b = a + 1; b < positions.length; b++) {
				const sign = Math.sign(positions[b] - positions[a]);
				velocities[a] += sign;
				velocities[b] -= sign;
			}
		}

		for (let i = 0; i < positions.length; i++) {
			positions[i] += velocities[i];
		}

		steps += 1;
	} while (!velocities.every((e) => e === 0));

	return steps * 2;
}

const gcd = (_x: number, _y: number) => {
	let x = _x;
	let y = _y;
	while (y !== 0) {
		[x, y] = [y, x % y];
	}
	return x;
};

const lcm = (x: number, y: number) => (x * y) / gcd(x, y);
const lcm3 = (x: number, y: number, z: number) => lcm(x, lcm(y, z));

solutions[0] = (input: Input, run = false): number =>  {
	const moons = input.map(({x, y, z}) => new Moon(x, y, z));
	for (let i = 0; i < 1000; i++) {
		
		for (let a = 0; a < moons.length; a++) {
			for (let b = a + 1; b < moons.length; b++) {
				moons[a].applyGravity(moons[b]);
				moons[b].applyGravity(moons[a]);
			}
		}

		for (let i = 0; i < moons.length; i++) {
			moons[i].update();
		}
	}

	let total = 0;

	for (let i = 0; i < moons.length; i++) {
		total += moons[i].energy;
	}

  return total;
}

solutions[1] = (input: Input, run = false): number =>  {
	const x = findCycle(input.map(({ x }) => x));
	const y = findCycle(input.map(({ y }) => y));
	const z = findCycle(input.map(({ z }) => z));

	return lcm3(x, y, z);
}