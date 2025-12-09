import type { MessageData, Result, SolutionFile } from './types.ts';

self.onmessage = async ({ data }: MessageEvent<MessageData>) => {
	const { solutions, parseInput } = (await import(data.path)) as SolutionFile;
	const solution = solutions[data.solutionIndex];

	if (!solution) {
		throw new Error(`Solution function at index ${data.solutionIndex} not found.`);
	}

	const input = parseInput(data.input);

	const performanceStart = performance.now();
	const result = await Promise.resolve(solution(input));
	const performanceEnd = performance.now();

	const solutionPerformance = Math.round((performanceEnd - performanceStart) * 100) / 100;

	const response: Result = {
		index: data.solutionIndex,
		performance: solutionPerformance,
		result: result,
	};

	self.postMessage(response);
};