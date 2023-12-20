const keys = ['x', 'm', 'a', 's'] as const;
type Instruction = (part: Part) => string | boolean;
type InstructionPart = {
	type: 'VALUE';
	pointer: boolean | string;
} | {
	type: 'COMPARISON';
	compare_index: number;
	compare_type: '>' | '<';
	compare_value: number;
	pointer: boolean | string;
}
type Part = [number, number, number, number];
type Input = {
	instructions: Map<string, Instruction>;
	parts: Array<Part>;
};

export const parseInput = (rawInut: string): Input => {
	const regex_numebrs = /\d+/g;
	const regex_instruction = /^(?<key>\w+)\{(?<instruction>.+)\}$/;
	const [instructions_raw, parts_raw] = rawInut.split(/\r?\n\r?\n/g);

  const instructions = new Map<string, Instruction>(instructions_raw.split(/\r?\n/g).map(line => {
		const groups = regex_instruction.exec(line)?.groups
		if (!groups || !groups.key || !groups.instruction) throw new Error("UNABLE TO PARSE INSTRUCTION");
		const instructions = groups.instruction.split(',').map((part): InstructionPart => {
			if (!part.includes(':')) {
				return {
					type: 'VALUE',
					pointer: part === 'A' ? true : part === 'R' ? false : part,
				}
			} else {
				const pointer = part.split(':')[1];
				return {
					type: "COMPARISON",
					pointer: pointer === 'A' ? true : pointer === 'R' ? false : pointer,
					compare_index: keys.indexOf(part.split(/<|>/)[0] as typeof keys[number]),
					compare_type: part.includes('<') ? '<' : '>',
					compare_value: parseInt(part.split(/<|>|:/)[1]),
				}
			}
		});
		// console.log(instructions)

		const instruction: Instruction = (part: Part) => {
			for (let i = 0; i < instructions.length; i++) {
				const instruction = instructions[i]
				if (instruction.type === 'VALUE') return instruction.pointer;

				if (instruction.compare_type === '<') {
					if (part[instruction.compare_index] < instruction.compare_value) return instruction.pointer
				} else {
					if (part[instruction.compare_index] > instruction.compare_value) return instruction.pointer
				}
			}

			throw new Error("NO FURTHER INSTRUCTION");
		}

		return [groups.key, instruction];
	}));

  const parts = parts_raw.split(/\r?\n/g).map(line => {
		const res = line.match(regex_numebrs)?.map(e => parseInt(e, 10))
		if (!res || res.length !== 4) throw new Error("INVALID PART");

		return res as Part;
	});

	return { instructions, parts }
}

export const solution1 = (input: Input, run = false): number =>  {
  // if (!run) return -1;

	const accepted: Array<Part> = [];
	for (let i = 0; i < input.parts.length; i++) {
		let next: boolean | string = 'in';

		while (typeof next === 'string') {
			const instruction = input.instructions.get(next);
			if (!instruction) {
				throw new Error(`NO INSTRUCTION FOUND: '${next}'`);
			}
			
			const result = instruction(input.parts[i]);
			if (result === false) break;
			if (result === true) {
				accepted.push(input.parts[i]);
				break;
			}
			next = result;
		}
	}

	let sum = 0;
	for (let i = 0; i < accepted.length; i++) {
		for (let j = 0; j < accepted[i].length; j++) {
			sum += accepted[i][j]
		}
	}

  return sum;
}

export const solution2 = (input: Input, run = false): number =>  {
  if (!run) return -1;
  return 0;
}

const example = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`

console.log('example:', solution1(parseInput(example), true));