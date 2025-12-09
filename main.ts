import {
  whichDayToRun,
  renderSolutionTable,
  getAllYears,
  getAllDaysInAYear,
consoleClear,
} from '/src/functions/print.ts';
import { join as joinPath } from '@std/path';
import { parseArgs } from "@std/cli";
import { Result, SolutionFile } from "./types.ts";

const WORKER_PATH = new URL('./worker.ts', import.meta.url).href;
let iteration = 0;

const getInut = async (year: string, day: string) => {
  const path = joinPath(Deno.cwd(), year, day, `input.txt`);
  return await Deno.readTextFile(path);
}

const getSolutions = async <Input>(year: string, day: string, iteration?: number): Promise<SolutionFile<Input> & { path: string; }> => {
  const path = `file:\\\\${joinPath(Deno.cwd(), year, day, `solution.ts#${iteration}`)}`;
  return { ...await import(path), path };
}


const parsedArgs = parseArgs(Deno.args);
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
      const { solutions, runExamples, path } = await getSolutions(year, day, iteration);
      const rawInput = await getInut(year, day);
			if (parsedArgs['include-examples']) {
				if (runExamples) {
					await runExamples();
				} else {
					console.warn(`WARN: argument 'include-examples' is true, but function 'runExamples' does not exists!`);
				}
			}

			const results: Array<Result> = await Promise.all(solutions.map((_, solutionIndex) => new Promise<Result>((resolve, reject) => {
				const worker = new Worker(WORKER_PATH, {
					name: `solution-${year}-${day}-${solutionIndex}-${iteration}`,
					type: 'module',
				});

				worker.addEventListener('message', ({ data }: MessageEvent<Result>) => {
					worker.terminate();
					resolve(data);
				});

				worker.addEventListener('error', (event: ErrorEvent) => {
					worker.terminate();
					reject(event.message);
				});

				worker.postMessage({
					path,
					input: rawInput,
					solutionIndex,
				});
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