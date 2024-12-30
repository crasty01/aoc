type Input = {
	program: Array<number>;
	registers: Array<number>;
};

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const [rawRegisters, rawProgram] = rawInut.split(/\r?\n\r?\n/g);
	const registers = rawRegisters.split(/\r?\n/g).map(line => parseInt(line.slice('Register X: '.length).trim(), 10));
	const program = rawProgram.slice('Program: '.length).trim().split(',').map(e => parseInt(e, 10));

	return {
		program,
		registers,
	}
}

class Computer {
	#program: Array<number> = [];
	#output = 0;
	#pointer = 0;
	#A = 0;
	#B = 0;
	#C = 0;
	#Aog = 0;
	#Bog = 0;
	#Cog = 0;

	constructor(program: Array<number>, registers: Array<number>, pointer: number) {
		this.#A = registers[0];
		this.#Aog = registers[0];
		this.#B = registers[1];
		this.#Bog = registers[1];
		this.#C = registers[2];
		this.#Cog = registers[2];
		this.#program = program;
		this.#pointer = pointer;
	}

	set program(program: Array<number>) { this.#program = program }
	set A(A: number) { this.#A = A }
	set B(B: number) { this.#B = B }
	set C(C: number) { this.#C = C }
	set pointer(pointer: number) { this.#pointer = pointer }

	get output() {
		return this.#output;
	}

	tick() {
		if (this.#pointer >= this.#program.length) {
			// console.warn('PROGRAM HALTED');
			return false
		}
		
		const [opcode, operand] = [this.#program[this.#pointer], this.#program[this.#pointer + 1]];
		switch (opcode) {
			case 0:
				this.adv(operand);
				break;
			case 1:
				this.bxl(operand);
				break;
			case 2:
				this.bst(operand);
				break;
			case 3:
				this.jnz(operand);
				break;
			case 4:
				this.bxc(operand);
				break;
			case 5:
				this.out(operand);
				break;
			case 6:
				this.bdv(operand);
				break;
			case 7:
				this.cdv(operand);
				break;
			default:
				console.error(`UNKNOWN OPCODE '${opcode}'`)
				return false
		}

		return true
	}

	run(a?: number, b?: number, c?: number) {
		this.#pointer = 0;
		this.#output = 0;
		this.#A = a ?? this.#Aog;
		this.#B = b ?? this.#Bog;
		this.#C = c ?? this.#Cog;
		
		let valid = true;
		do {
			valid = this.tick()
		} while (valid);

		return this.output;
	}

	combo(operand: number) {
		switch (operand) {
			case 0:
			case 1:
			case 2:
			case 3:
				return operand;
			case 4:
				return this.#A;
			case 5:
				return this.#B;
			case 6:
				return this.#C;
			case 7:
				throw new Error(`7 IS INVALID OPERAND`);
			default:
				throw new Error(`UNKNOWN OPERAND`);
		}
	}

	//#region operations
	adv(operand: number) {
		this.#A = Math.floor(this.#A / ( 2**this.combo(operand) ));
		this.#pointer += 2;
	}

	bxl(operand: number) {
		this.#B = this.#B ^ operand;
		this.#pointer += 2;
	}

	bst(operand: number) {
		this.#B = this.combo(operand) % 8;
		this.#pointer += 2;
	}

	jnz(operand: number) {
		this.#pointer = this.#A === 0 ? this.#pointer + 2 : operand;
	}

	bxc(_: number) {
		this.#B = this.#B ^ this.#C;
		this.#pointer += 2;
	}

	out(operand: number) {
		this.#output = this.output * 10 + (this.combo(operand) % 8);
		this.#pointer += 2;
	}

	bdv(operand: number) {
		this.#B = Math.floor(this.#A / ( 2**this.combo(operand) ));
		this.#pointer += 2;
	}

	cdv(operand: number) {
		this.#C = Math.floor(this.#A / ( 2**this.combo(operand) ));
		this.#pointer += 2;
	}
	//#endregion operations
}

solutions[0] = ({ program, registers }: Input, run = false): number | string => {
	const computer = new Computer(program, registers, 0);

	const output = computer.run(
		registers[0],
		registers[1],
		registers[2],
	)

  return (output + '').split('').join(',');
}

solutions[1] = ({ program, registers }: Input, run = false): number => {
	const control = parseInt(program.join(''), 10);
	
	const computer = new Computer(program, registers, 0);
	const n = 10**15;

	for (let i = 10**14; i < n; i++) {
		if (control === computer.run(i)) return i
	}

	return -1
}

/*
0 - adv -> Math.floor(A/(2**combo)) << A
1 - bxl -> B^literal << B
2 - bst -> combo%8 << B
3 - jnz -> A === 0 ? noop : (pointer = literal)
4 - bxc -> B^C << B
5 - out -> combo%8 << output
6 - bdv -> Math.floor(A/(2**combo)) << B
7 - cdv -> Math.floor(A/(2**combo)) << C
*/

const example = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

// console.log('result:', solutions[1](parseInput(example), true));