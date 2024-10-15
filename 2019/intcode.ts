type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Ctx = {
	inputs: Array<number>;
	memory: Array<number>;
	pointer: number;
	relative: number;
	log: boolean;
}

export function* intcode (_ctx: PartialBy<Ctx, 'pointer' | 'relative' | 'log'>): Generator<number, undefined> {
	if (_ctx.pointer === undefined) _ctx.pointer = 0;
	if (_ctx.relative === undefined) _ctx.relative = 0;
	if (_ctx.log === undefined) _ctx.log = false;
	const ctx = _ctx as Ctx;

	// console.log(ctx.memory.join(','));
	// console.log('----------');

	const get_real_pointer = (mode: number, pointer: number) => {
		// if (mode === 2) console.log(ctx.relative, pointer, ctx.memory[pointer]);
		switch (mode) {
			case 0: return ctx.memory[pointer]
			case 1: return pointer;
			case 2: return ctx.relative + ctx.memory[pointer];
			default: throw new Error(`BAD MEMORY MODE: ${mode}, ctx: ${JSON.stringify(ctx)}`);
		}
	}

	const get_value = (pointer: number) => {
		if (ctx.memory[pointer] === undefined) ctx.memory[pointer] = 0;
		return ctx.memory[pointer];
	}

	while (true) {
		const [a, b, c, d, e] = String(ctx.memory[ctx.pointer]).padStart(5, '0');
		const modes: Array<number> = [parseInt(c, 10), parseInt(b, 10), parseInt(a, 10)];
		const indexes = modes.map((mode, i) => get_real_pointer(mode, ctx.pointer + i + 1));
		const opcode = (d + e);

		if (modes[2] === 1) {
			console.log({ modes, indexes, opcode, pointer: ctx.pointer, relative: ctx.relative });
			throw new Error(`3RD PARAMETER IS NOT ZERO! mode: ${modes[2]}`);
		}
		
		switch (opcode) {
			case '01': // addition
				ctx.memory[indexes[2]] = get_value(indexes[0]) + get_value(indexes[1]);
				ctx.pointer += 4;
				if (ctx.log) console.log(`addition: ${get_value(indexes[0])} + ${get_value(indexes[1])} = ${ctx.memory[indexes[2]]}`);
				break;
			case '02': // multiplication
				ctx.memory[indexes[2]] = get_value(indexes[0]) * get_value(indexes[1]);
				ctx.pointer += 4;
				if (ctx.log) console.log(`multiplication: ${get_value(indexes[0])} * ${get_value(indexes[1])} = ${ctx.memory[indexes[2]]}`);
				break;
			case '03': // input
				if (ctx.inputs.length === 0) throw new Error(`NO INPUT FOUND`);
				ctx.memory[indexes[0]] = ctx.inputs.shift()!;
				ctx.pointer += 2;
				if (ctx.log) console.log(`input: ${ctx.memory[indexes[0]]}`);
				break;
			case '04': // output
				ctx.pointer += 2;
				yield ctx.memory[indexes[0]];
				if (ctx.log) console.log(`output: ${ctx.memory[indexes[0]]}`);
				break;
			case '05': // jump-if-true
				ctx.pointer = get_value(indexes[0]) !== 0 ? get_value(indexes[1]) : ctx.pointer + 3;
				if (ctx.log) console.log(`jump-if-true: ${ctx.pointer}`);
				break;
			case '06': // jump-if-false
				ctx.pointer = get_value(indexes[0]) === 0 ? get_value(indexes[1]) : ctx.pointer + 3;
				if (ctx.log) console.log(`jump-if-false: ${ctx.pointer}`);
				break;
			case '07': // less-than
				ctx.memory[indexes[2]] = get_value(indexes[0]) < get_value(indexes[1]) ? 1 : 0;
				ctx.pointer += 4;
				if (ctx.log) console.log(`less-than: ${get_value(indexes[0])} < ${get_value(indexes[1])}`);
				break;
			case '08': // equal
				ctx.memory[indexes[2]] = get_value(indexes[0]) === get_value(indexes[1]) ? 1 : 0;
				ctx.pointer += 4;
				if (ctx.log) console.log(`equal: ${get_value(indexes[0])} < ${get_value(indexes[1])}`);
				break;
			case '09': // set-relative-pointer
				ctx.relative += get_value(indexes[0]);
				ctx.pointer += 2;
				if (ctx.log) console.log(`set-relative-pointer: ${ctx.relative}`);
				break;
			case '99':
				return undefined;
			default:
				throw new Error(`UNKNOWN OPCODE: ${opcode}`);
		}

		// console.log(ctx.memory.join(','));
	}
}