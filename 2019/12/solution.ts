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
  if (!run) return -1;
  return 0;
}

// const example = `<x=-8, y=-10, z=0>
// <x=5, y=5, z=10>
// <x=2, y=-7, z=3>
// <x=9, y=-8, z=-3>`;

// console.log(solutions[0](parseInput(example), true));