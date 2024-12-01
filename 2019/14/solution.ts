type Input = Map<string, Recipe>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  return new Map(rawInut.split(/\r?\n/g).map(e => {
		const recipe = new Recipe(e)
		return [recipe.material, recipe];
	}));
}

class Material {
	id: string;
	amount: number;

	constructor(id: string, amount: number) {
		this.id = id;
		this.amount = amount;
	}
}

class Recipe {
	material: string;
	amount: number;
	resources: Array<Material>;
	
	constructor(formula: string) {
		const [list, result] = formula.split(' => ');
		const [_amount, _material] = result.split(' ');

		this.material = _material;
		this.amount = parseInt(_amount);

		this.resources = list.split(', ').map(e => {
			const [_a, _m] = e.split(' ');
			return new Material(_m, parseInt(_a));
		});
	}

	getMeasuredResources(value: number) {
		const k = Math.ceil(value / this.amount);
		return this.resources.map(m => new Material(m.id, m.amount * k));
	}

	static traceFuelToOre(recipes: Map<string, Recipe>, n = 1) {
		let ore = 0;
		const resources: Array<Material> = []
		const overflows = new Map<string, number>();
		resources.push(new Material('FUEL', n));

		while (resources.length > 0) {
			const resource = resources.shift()!;
			const recipe = recipes.get(resource.id);

			if (!recipe) throw new Error(`NO VALID RECIPE FOR '${resource.id}' found`);
			
			const amount = resource.amount - (overflows.get(resource.id) ?? 0);
			overflows.delete(resource.id);
			const k = Math.ceil(amount / recipe.amount);
			const resourcesNeeded = recipe.resources.map(m => new Material(m.id, m.amount * k));
			const overflow = (k * recipe.amount) - amount;
			if (overflow > 0) overflows.set(resource.id, (overflows.get(resource.id) ?? 0) + overflow);

			for (const res of resourcesNeeded) {
				if (res.id === 'ORE') {
					ore += res.amount;
					continue;
				}

				resources.push(res);
			}
		}

		return ore;
	}
}

solutions[0] = (input: Input, run = false): number =>  {
	return Recipe.traceFuelToOre(input);
}

// from: https://www.reddit.com/r/adventofcode/comments/eafj32/comment/faqkkwv
solutions[1] = (input: Input, run = false): number =>  {
	let fuel = 1
	const target = 1e12;
	while (true) {
		const ore = Recipe.traceFuelToOre(input, fuel + 1);
		if (ore > target) {
			return fuel;
		} else {
			fuel = Math.max(fuel + 1, Math.floor((fuel + 1) * (target / ore)));
		}
	}
}