type Update = Array<number>;
type Updates = Array<Update>;
type Rules = Map<number, Array<number>>;

type Input = {
	updates: Updates;
	rules: Rules;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [_rules, _updates] = rawInut.split(/\r?\n\r?\n/);

	const rules = new Map<number, Array<number>>();
	for (const line of _rules.split(/\r?\n/)) {
		const [key, value] = line.split('|').map(e => parseInt(e, 10));
		if (!rules.has(key)) rules.set(key, []);
		rules.get(key)?.push(value);
	}

	const updates = _updates.split(/\r?\n/).map(line => line.split(',').map(e => parseInt(e, 10)));

	return {
		rules,
		updates,
	};
}

const getMiddlePageValue = (rules: Rules, update: Update): [boolean, number] => {
	let wasBroken = false;

	for (let i = 0; i < update.length; i++) {
		const rule = rules.get(update[i]);
		if (!rule) continue;

		const brokenRule = rule.find(r => {
			const ri = update.indexOf(r);
			return ri >= 0 && ri < i;
		});

		if (brokenRule) {
			const j = update.indexOf(brokenRule);
			[update[i], update[j]] = [update[j], update[i]];
			i = -1;
			wasBroken = true;
		}
	}

	return [wasBroken, update[update.length >> 1]];
}

solutions[0] = (input: Input, run = false): number => {
	let sum = 0;

	for (const update of input.updates) {
		const [wasBroken, value] =  getMiddlePageValue(input.rules, update);
		sum += wasBroken ? 0 : value;
	}

  return sum;
}

solutions[1] = (input: Input, run = false): number => {
	let sum = 0;

	for (const update of input.updates) {
		const [wasBroken, value] =  getMiddlePageValue(input.rules, update);
		sum += wasBroken ? value : 0;
	}

  return sum;
}

const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

console.log('result #1:', solutions[0](parseInput(example), true));
console.log('result #2:', solutions[1](parseInput(example), true));