import {
  whichDayToRun,
  renderSolutionTable,
  getAllYears,
  getAllDaysInAYear,
consoleClear,
} from '/src/functions/print.ts';
import { join as joinPath } from 'std/path/mod.ts';
import { parse } from "std/flags/mod.ts";

let iteration = 0;

const getInut = async (year: string, day: string) => {
  const path = joinPath(Deno.cwd(), year, day, `input.txt`);
  return await Deno.readTextFile(path);
}

const getSolutions = async (year: string, day: string, iteration?: number) => {
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
      const { parseInput, solution1, solution2 } = await getSolutions(year, day, iteration);
      const rawInut = await getInut(year, day);

      const solution1PerformanceStart = performance.now();
      const solution1Result = await solution1(parseInput(rawInut));
      const solution1PerformanceEnd = performance.now();
      const solution1Performance = Math.round((solution1PerformanceEnd - solution1PerformanceStart) * 100) / 100;
      const solution2PerformanceStart = performance.now();
      const solution2Result = await solution2(parseInput(rawInut));
      const solution2PerformanceEnd = performance.now();
      const solution2Performance = Math.round((solution2PerformanceEnd - solution2PerformanceStart) * 100) / 100;

			if (!parsedArgs['no-results']) {
				renderSolutionTable([
					[`${year}-${day}-01`, solution1Result, `${solution1Performance} ms`],
					[`${year}-${day}-02`, solution2Result, `${solution2Performance} ms`],
				], { year, day })
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