
import { Select, SelectValueOptions } from '/src/services/cli.ts';
import { Table } from 'cliffy/table/mod.ts';
import { colors } from 'cliffy/ansi/colors.ts';
import { join as joinPath,  } from 'std/path/mod.ts';

const CWD = Deno.cwd();
const DAYS_PATH = (year: string) => joinPath(CWD, year);

export const getAllYears = async () => {
  const years: Array<string> = [];
  for await (const dirEntry of Deno.readDir(CWD)) {
    if (!dirEntry.isDirectory) continue;
    if (!/^\d{4}$/.exec(dirEntry.name)) continue;
    years.push(dirEntry.name);
  }
  return years;
}

export const getAllDaysInAYear = async (year: string) => {
  const days: Array<string> = [];
  const dir = DAYS_PATH(year);
  for await (const dirEntry of Deno.readDir(dir)) {
    const splitted = dirEntry.name.split('.');
    const name = splitted.slice(0, -1).join('.');
    const extention = splitted.at(-1);

    if (extention !== 'ts') continue;

    days.push(name);
  }
  return days;
}

export const whichDayToRun = async (message = {
  year: 'Select year you want to run',
  day: 'Select day you want to run',
}): Promise<{
  year?: string;
  day?: string;
}> => {
  const year = await Select.prompt({
    message: message.year,
    info: true,
    options: ['all', ...await getAllYears()],
  });

  if (year === 'all') return {};

  const day = await Select.prompt({
    message: message.day,
    info: true,
    options: ['all', ...await getAllDaysInAYear(year)],
  });

  if (day === 'all') return { year };

  return { year, day };
}

export const renderSolutionTable = (
  body: Array<[string, number | string, string]>,
  options: {
    year: string;
    day: string;
  }
) => {
  
  console.log(
    '\n\n',
    colors.white(`   Solutions for AoC`),
    colors.bold.green(`${options.year}`),
    colors.white(`- day`),
    colors.bold.green(`${options.day}`),
  );

  new Table()
    .header(['', 'result', 'time'])
    .body(body)
    .padding(1)
    .indent(3)
    .border(true)
    .render();
}