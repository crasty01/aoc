import {
  whichDayToRun,
  renderSolutionTable,
  getAllYears,
  getAllDaysInAYear,
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


// console.clear();
// console.log(parse(Deno.args));
const watcher = parse(Deno.args).w ? Deno.watchFs(".") : [];
const config = await whichDayToRun({
  year: String(parse(Deno.args).year).padStart(4, '0'),
  day: String(parse(Deno.args).day).padStart(2, '0'),
});
const years = config.year ? [config.year] : await getAllYears();

const run = async (iteration = 0) => {
  // console.clear();
  
  for (const year of years) {
    const days = config.day ? [config.day] : await getAllDaysInAYear(year);

    for (const day of days) {
      const { parseInput, solution1, solution2 } = await getSolutions(year, day, iteration);
			// console.log('running', year, day)
      const rawInut = await getInut(year, day);

      const solution1PerformanceStart = performance.now();
      const solution1Result = await solution1(parseInput(rawInut));
      const solution1PerformanceEnd = performance.now();
      const solution1Performance = Math.round((solution1PerformanceEnd - solution1PerformanceStart) * 100) / 100;
      const solution2PerformanceStart = performance.now();
      const solution2Result = await solution2(parseInput(rawInut));
      const solution2PerformanceEnd = performance.now();
      const solution2Performance = Math.round((solution2PerformanceEnd - solution2PerformanceStart) * 100) / 100;

      renderSolutionTable([
        [`${year}-${day}-01`, solution1Result, `${solution1Performance} ms`],
        [`${year}-${day}-02`, solution2Result, `${solution2Performance} ms`],
      ], {
        year,
        day
      })

    }
  }
  console.log('\n');
}
await run();
for await (const _ of watcher) {
  await run(++iteration);
}

console.log('\n');