import {
  whichDayToRun,
  renderSolutionTable,
  getAllYears,
  getAllDaysInAYear,
consoleClear,
} from '/src/functions/print.ts';
import { join as joinPath } from 'std/path/mod.ts';
import { parse } from "std/flags/mod.ts";

type Result = {
	index: number;
	result: number | string;
	performance: number;
}

let iteration = 0;

const getInut = async (year: string, day: string) => {
  const path = joinPath(Deno.cwd(), year, day, `input.txt`);
  return await Deno.readTextFile(path);
}

const getSolutions = async <Input>(year: string, day: string, iteration?: number): Promise<{
	parseInput: (rawInut: string) => Input;
	solutions: Array<(input: Input) => Promise<number | string>>;
	tests?: Array<(input: Input) => Promise<number | string>>;
}> => {
  const path = `file:\\\\${joinPath(Deno.cwd(), year, day, `solution.ts#${iteration}`)}`;
  return await import(path);
}


const parsedArgs = parse(Deno.args);
const watcher = parsedArgs.w ? Deno.watchFs(".") : [];
const config = await whichDayToRun({
  year: String(parsedArgs.year).padStart(4, '0'),
  day: String(parsedArgs.day).padStart(2, '0'),
});
const years = config.year ? [config.year] : await getAllYears();

const run = async (iteration = 0) => {

	if (parsedArgs.clear) {
		consoleClear(true);
	}

  for (const year of years) {
    const days = config.day ? [config.day] : await getAllDaysInAYear(year);

    for (const day of days) {
      const { parseInput, solutions, tests } = await getSolutions(year, day, iteration);
      const rawInut = await getInut(year, day);
			const functions = parsedArgs['include-tests'] ? [...solutions, ...(tests ?? [])] : solutions;
			const results: Array<Result> = await Promise.all(functions.map((solution, solutionIndex) => new Promise<Result>((resolve, reject) => {
				const solutionPerformanceStart = performance.now();
				console.log(solution.name)
				Promise.resolve(solution(parseInput(rawInut))).then((result) => {
					const solutionPerformanceEnd = performance.now();
					const solutionPerformance = Math.round((solutionPerformanceEnd - solutionPerformanceStart) * 100) / 100;

					resolve({
						index: solutionIndex,
						performance: solutionPerformance,
						result: result,
					})
				}).catch(reject)
			})));

			if (!parsedArgs['no-results']) {
				renderSolutionTable(results.map(({
					index,
					result,
					performance
				}) => [
					`${year}-${day}-${(index + 1).toString().padStart(2, '0')}`,
					result,
					`${performance} ms`
				]),
					{ year, day }
				)
			}

    }
  }
  console.log('\n');
}
await run();
for await (const _ of watcher) {
  await run(++iteration);
}

console.log('\n');