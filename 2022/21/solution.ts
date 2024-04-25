type MonkeyName = string;
type Operation = '-' | '+' | '/' | '*';
// type MonkeyNumber = {
// 	value: number;
// }
// type MonkeyOperation = {
// 	value: undefined | number;
// 	a: MonkeyName;
// 	b: MonkeyName;
// 	op: Operation;
// }
// type Monkey = MonkeyNumber | MonkeyOperation;
type Monkey = {
	name: MonkeyName;
	value: undefined | number;
	a: MonkeyName;
	b: MonkeyName;
	neededBy: undefined | MonkeyName;
	op: Operation;
}
type Input = Map<MonkeyName, Monkey>;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const entries = rawInut.replace(/\r\n/g, '\n').split('\n').map(line => {
		const [name, yell] = line.split(': ');
		if (yell.length > 4) {
			const [a, op, b] = yell.split(' ');
			return [name, {
				name,
				value: undefined,
				a, b, op,
			}];
		} else {
			return [name, {
				name,
				value: parseInt(yell),
			}];
		}
	}) as Array<[MonkeyName, Monkey]>;

	const map = new Map(entries);

	for (const [key, value] of entries) {
		if (!value.op) continue;
		const a = map.get(value.a)!
		const b = map.get(value.b)!;
		if (a.neededBy || a.neededBy) throw new Error("neededBy should be empty!");
		
		a.neededBy = key;
		b.neededBy = key;
	}

	return map;
}

solutions[0] = (input: Input): number => {
	const getMonkeyValue = (monkeyName: MonkeyName): number => {
		const monkey = input.get(monkeyName)!;
		if (!monkey.value) {
			const a = getMonkeyValue(monkey.a)
			const b = getMonkeyValue(monkey.b)
			switch (monkey.op) {
				case '-':
					monkey.value = a - b;
					break;
				case '+':
					monkey.value = a + b;
					break;
				case '*':
					monkey.value = a * b;
					break;
				case '/':
					monkey.value = a / b;
					break;
			
				default:
					throw new Error("Unknown pperation!");
			}
		}

		return monkey.value!;
	}

	return getMonkeyValue('root');
}

solutions[1] = (input: Input): number => {
	const tempForHumn = Infinity;
	const isInf = (monkey: Monkey): boolean => {
		return monkey.value === Infinity || monkey.value === -Infinity;
	}

	const getMonkeyValue = (monkeyName: MonkeyName): number => {
		if (monkeyName === 'humn') return tempForHumn;

		const monkey = input.get(monkeyName)!;
		if (!monkey.value) {
			const a = getMonkeyValue(monkey.a);
			const b = getMonkeyValue(monkey.b);
			switch (monkey.op) {
				case '-':
					monkey.value = a - b;
					break;
				case '+':
					monkey.value = a + b;
					break;
				case '*':
					monkey.value = a * b;
					break;
				case '/':
					monkey.value = a / b;
					break;
			
				default:
					throw new Error("Unknown pperation!");
			}
		}

		return monkey.value!;
	}

	getMonkeyValue('root')!; // populate
	const root = input.get('root')!;
	const tmp = input.get(root.a)!;

	const stack: Array<Monkey> = [input.get('humn')!];
	while (stack.at(-1)?.neededBy !== 'root') {
		stack.push(input.get(stack.at(-1)?.neededBy!)!);
	}

	let acc = (isInf(tmp) ? input.get(root.b)! : tmp).value!;
	let a: Monkey;
	let b: Monkey;
	while(stack.length > 0) {
		const current = stack.pop()!;
		current.value = acc;
		if (!current.op) continue;

		a = input.get(current.a)!
		b = input.get(current.b)!
		const useA = isInf(a) || a.name === 'humn' ? false : true;

		switch (`${useA ? 'a' : 'b'}${current.op}`) {
			case 'a+': // a + ... = acc    =>    ... = acc - a
				acc = acc - a.value!;
				break;
			case 'a*': // a * ... = acc    =>    ... = acc / a
				acc = acc / a.value!;
				break;
			case 'a-': // a - ... = acc    =>    ... = a - acc
				acc = a.value! - acc;
				break;
			case 'a/': // a / ... = acc    =>    ... = a / acc
				acc = a.value! / acc;
			break;

			case 'b+': // ... + b = acc    =>    ... = acc - b
				acc = acc - b.value!;
				break;
			case 'b*': // ... * b = acc    =>    ... = acc / b
				acc = acc / b.value!;
				break;
			case 'b-': // ... - b = acc    =>    ... = acc + b
				acc = acc + b.value!;
				break;
			case 'b/': // ... / b = acc    =>    ... = acc * b
				acc = acc * b.value!;
				break;
		
			default:
				throw new Error("Unknown operation!");
		}
	}

	return input.get('humn')!.value!;
}

// const example = `root: pppw + sjmn
// dbpl: 5
// cczh: sllz + lgvd
// zczc: 2
// ptdq: humn - dvpt
// dvpt: 3
// lfqf: 4
// humn: 5
// ljgn: 2
// sjmn: drzm * dbpl
// sllz: 4
// pppw: cczh / lfqf
// lgvd: ljgn * ptdq
// drzm: hmdt - zczc
// hmdt: 32`;
// console.log('Example 1:', solutions[0](parseInput(example)));
// console.log('Example 1:', solutions[1](parseInput(example), true));