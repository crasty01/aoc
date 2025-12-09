export type Result = {
	index: number;
	result: number | string;
	performance: number;
}

export type MessageData = {
	path: string;
	input: string;
	solutionIndex: number;
}

export type SolutionFile<Input = unknown> = {
	parseInput: (rawInput: string) => Input;
	solutions: Array<(input: Input) => Promise<number | string>>;
	runExamples?: () => Promise<void>;
}