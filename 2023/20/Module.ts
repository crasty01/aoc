export type ModulType = 'B' | '%' | '&' | '+';
export type SignalType = true | false;
export type Pulse = {
	transmitter: string;
	receiver: string;
	signal: SignalType;
}

export interface Module {
	name: string;
	type: ModulType;
	recievers: Array<string>;

	trigger(signal: SignalType, transmitter: string): void;
}

export class ModuleSet {
	#queue: Array<Pulse>;
	#modules: Map<string, Module>

	constructor() {
		this.#queue = [];
		this.#modules = new Map();
	}

	addModule(module: Module) {
		this.#modules.set(module.name, module);
	}

	addToQueue(pulse: Pulse) {
		this.#queue.push(pulse);
	}

	pushButton(
		signal: SignalType,
		check?: (pulse: Pulse) => void,
	) {
		const broadcaster = this.#modules.get('broadcaster');
		if (!broadcaster) throw new Error("No broadcaster found!");
		
		const signals = [];

		this.#queue.push({
			receiver: 'broadcaster',
			transmitter: 'button',
			signal,
		});

		while (this.#queue.length > 0) {
			const pulse = this.#queue.shift()!;
			signals.push(pulse.signal);

			check?.(pulse)

			// console.log(`${pulse.transmitter} -${pulse.signal ? 'high' : 'low'}-> ${pulse.receiver}`)

			const receiver = this.#modules.get(pulse.receiver);
			if (receiver) {
				receiver.trigger(pulse.signal, pulse.transmitter);
			}
		}

		return signals.map(e => +e).join('')
	}

	getModule(name: string) {
		return this.#modules.get(name);
	}

	getModules() {
		return this.#modules;
	}

	toString() {
		return JSON.stringify([...this.#modules.values()].map(e => ({
			name: e.name,
			type: e.type,
			recievers: e.recievers,
		})), null, 2);
	}
}

export class BroadcasterModule implements Module {
	#type: ModulType;
	#name: string;
	#receivers: Array<string>;
	#moduleSet: ModuleSet;

	constructor(name: string, receivers: Array<string>, moduleSet: ModuleSet) {
		this.#type = 'B';
		this.#name = name;
		this.#receivers = receivers;
		this.#moduleSet = moduleSet;
	}

	trigger(signal: SignalType, transmitter: string) {
		for (let i = 0; i < this.#receivers.length; i++) {
			this.#moduleSet.addToQueue({
				receiver: this.#receivers[i],
				transmitter: this.#name,
				signal,
			});
		}
	}

	get recievers() {
		return this.#receivers;
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}
}

export class FlipFlopModule implements Module {
	#type: ModulType;
	#name: string;
	#state: SignalType;
	#receivers: Array<string>;
	#moduleSet: ModuleSet;

	constructor(name: string, receivers: Array<string>, moduleSet: ModuleSet) {
		this.#type = '%';
		this.#name = name;
		this.#receivers = receivers;
		this.#state = false;
		this.#moduleSet = moduleSet;
	}

	trigger(signal: SignalType, transmitter: string) {
		if (signal) return; // if module receives a high pulse, it is ignored and nothing happens
		this.#state = !this.#state; // module receives a low pulse, it flips between on and off
		
		for (let i = 0; i < this.#receivers.length; i++) {
			this.#moduleSet.addToQueue({
				receiver: this.#receivers[i],
				transmitter: this.#name,
				signal: this.#state,
			})
		}
	}

	get state() {
		return this.#state;
	}

	get recievers() {
		return this.#receivers;
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}
}

export class ConjunctionModule implements Module {
	#type: ModulType;
	#name: string;
	#receivers: Array<string>;
	#transmitters: Map<string, SignalType> | undefined;
	#moduleSet: ModuleSet;

	constructor(name: string, receivers: Array<string>, moduleSet: ModuleSet) {
		this.#type = '&';
		this.#name = name;
		this.#receivers = receivers;
		this.#moduleSet = moduleSet;
	}

	setTransmitters(transmitters: Array<string>) {
		this.#transmitters = new Map();
		for (let i = 0; i < transmitters.length; i++) {
			this.#transmitters?.set(transmitters[i], false)
		}
	}

	trigger(signal: SignalType, transmitter: string) {
		if (!this.#transmitters) throw new Error(`Conjunction module '${this.#name}' does not have set transmitters!`);
		if (!this.#transmitters.has(transmitter)) throw new Error(`Conjunction module does not have previouse state for trannsmitter '${this.#name}'!`);
		
		this.#transmitters.set(transmitter, signal);
		const state = this.state;

		for (let i = 0; i < this.#receivers.length; i++) {
			this.#moduleSet.addToQueue({
				receiver: this.#receivers[i],
				transmitter: this.#name,
				signal: !state,
			})
		}
	}

	get state() {
		if (!this.#transmitters || this.#transmitters?.size === 0) return true;

		let s = true;
		for (const [_, transmitter] of this.#transmitters) {
			s = s && transmitter;
		}

		return s;
	}

	get transmitters() {
		return this.#transmitters;
	}

	get recievers() {
		return this.#receivers;
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}
}

export class CounterModule implements Module {
	#type: ModulType;
	#name: string;
	#state: [number, number];
	#moduleSet: ModuleSet;

	constructor(name: string, moduleSet: ModuleSet) {
		this.#type = '+';
		this.#name = name;
		this.#state = [0, 0];
		this.#moduleSet = moduleSet;
	}

	trigger(signal: SignalType, transmitter: string) {
		this.#state[+signal] += 1;
	}

	get state() {
		return this.#state;
	}

	get recievers() {
		return [];
	}

	get type() {
		return this.#type;
	}

	get name() {
		return this.#name;
	}
}