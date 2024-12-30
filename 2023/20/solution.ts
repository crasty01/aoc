import { BroadcasterModule, ConjunctionModule, CounterModule, FlipFlopModule, ModuleSet, Pulse } from "./Module.ts";
import { lcm } from "/src/functions/math.ts";

type Input = ModuleSet;

export const solutions: Array<(input: Input, run?: boolean) => number | string> = [];
export const parseInput = (rawInut: string): Input => {
  const moduleSet = new ModuleSet();
	const conjunctionTransmitters = new Map<string, Array<string>>();

	const modules = rawInut.split(/\r?\n/g).map(line => {
		const [raw_name, raw_receivers] = line.trim().split(' -> ');
		const type = raw_name[0];

		switch (type) {
			case '%': return new FlipFlopModule(raw_name.slice(1), raw_receivers.split(', '), moduleSet);
			case '&':
				conjunctionTransmitters.set(raw_name.slice(1), []);
				return new ConjunctionModule(raw_name.slice(1), raw_receivers.split(', '), moduleSet);
			case 'b':	return new BroadcasterModule(raw_name, raw_receivers.split(', '), moduleSet);
			default: throw new Error(`Invalid type '${type}'`);
		}
	});

	
	for (const module of modules) {
		moduleSet.addModule(module);
		for (let i = 0; i < module.recievers.length; i++) {
			if (conjunctionTransmitters.has(module.recievers[i])) {
				conjunctionTransmitters.get(module.recievers[i])?.push(module.name)
			}
		}
	}
	
	for (const [name, transmitters] of conjunctionTransmitters) {
		const module = moduleSet.getModule(name);
		if (!module || module.type !== "&") throw new Error(`Bad module '${name}'`);
		
		(module as ConjunctionModule).setTransmitters(transmitters);
	}
	
	return moduleSet;
}

solutions[0] = (input: Input): number => {
	let iter = 0;
	let high = 0;
	let low = 0;

	while (iter < 1000) {
		const result = input.pushButton(false);
		high += result.replace(/0/g, '').length
		low += result.replace(/1/g, '').length
		iter += 1;
	}

  return low * high;
}

solutions[1] = (input: Input): number => {
	input.addModule(new CounterModule('rx'));

	const modules = [...input.getModules().values()];
	const c = modules.find(module => module.recievers.includes('rx'));

	if (!c || !(c instanceof ConjunctionModule)) throw new Error('Unexpected input!');

	const transmitters: Array<{
		name: string;
		highSignals: Array<number>;
	}> = [...c.transmitters!.keys()].map(name => ({
		name,
		highSignals: [],
	}));

	let iter = 1;
	const check = (pulse: Pulse) => {
		if (pulse.receiver === c.name && pulse.signal) {
			transmitters.find(e => e.name === pulse.transmitter)!.highSignals.push(iter);
		}
	}

	while (true) {
		input.pushButton(false, check);
		// if (iter % 1_000_000 === 0) console.log(iter)
		
		if (transmitters.filter(tr => tr.highSignals.length < 1).length === 0) break;

		iter += 1;
	}

  return lcm(transmitters.map(tr => tr.highSignals[0]));
}