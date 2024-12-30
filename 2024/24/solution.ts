type Input = {
	values: Map<string, number>;
	gates: Array<{
		a: string;
		op: string;
		b: string;
		r: string;
	}>;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [_values, _gates] = rawInut.split(/\r?\n\r?\n/g);

	const values = new Map(_values.split(/\r?\n/g).map(line => {
		const [a, b] = line.split(': ');

		return [a, +b];
	}));

	const gates = _gates.split(/\r?\n/g).map(line => {
		const [a, op, b, r] = line.split(/ (?:-> )?/g);

		return { a, op, b, r };
	})

	return {
		values,
		gates,
	}
}

const gate = (a: number, b: number, op: string) => {
	switch (op) {
		case 'AND': return a & b;
		case 'XOR': return a ^ b;
		case 'OR': return a | b;
		default: throw new Error("UNKNOWN OPERATION");
	}
}

solutions[0] = ({ gates, values }: Input, run = false): number | string => {
	const queue = [...gates];
	const res = [];

	while (queue.length > 0) {
		const g = queue.shift()!;
		const { a, b, op, r } = g!;

		if (values.has(a) && values.has(b)) {
			const value = gate(values.get(a)!, values.get(b)!, op);
			values.set(r, value)
			if (r.startsWith('z')) {
				res[parseInt(r.slice(1))] = value;
			}
		} else {
			queue.push(g);
		}
	}

  return parseInt(res.reverse().join(''), 2);
}

solutions[1] = (input: Input, run = false): number => {
  if (!run) return -1;
  return 0;
}

const example = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`;

console.log('result:', solutions[0](parseInput(example), true));