import {
  whichDayToRun,
  renderSolutionTable,
  getAllYears,
  getAllDaysInAYear,
} from '/src/functions/print.ts';
import { join as joinPath } from 'std/path/mod.ts';

const getInut = async (year: string, day: string) => {
  const path = joinPath(Deno.cwd(), year, `${day}.txt`);
  return await Deno.readTextFile(path);
}

const getSolutions = async (year: string, day: string) => {
  const path = `file:\\\\${joinPath(Deno.cwd(), year, `${day}.ts`)}`;
  return await import(path);
}

console.clear();
const config = await whichDayToRun();
const years = config.year ? [config.year] : await getAllYears();

for (const year of years) {
  const days = config.day ? [config.day] : await getAllDaysInAYear(year);

  for (const day of days) {

    const { parseInput, solution1, solution2 } = await getSolutions(year, day);
    const rawInut = await getInut(year, day);

    const input = parseInput(rawInut);
    const solution1PerformanceStart = performance.now();
    const solution1Result = solution1(input);
    const solution1PerformanceEnd = performance.now();
    const solution1Performance = Math.round((solution1PerformanceEnd - solution1PerformanceStart) * 100) / 100;
    const solution2PerformanceStart = performance.now();
    const solution2Result = solution2(input);
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
console.log('\n\n');