
import { Select } from '/src/services/cli.ts';
import { Table } from 'cliffy/table/mod.ts';
import { colors } from 'cliffy/ansi/colors.ts';
import { join as joinPath,  } from 'std/path/mod.ts';

const CWD = Deno.cwd();
const DAYS_PATH = (year: string) => joinPath(CWD, year);

export const consoleClear = (fullClear = false) => {
  Deno.stdout.write(
    new TextEncoder().encode(fullClear ? "\x1b[2J" : "\x1b[0f"),
  );
}

export const getAllYears = async () => {
  const years: Array<string> = [];
  for await (const dirEntry of Deno.readDir(CWD)) {
    if (!dirEntry.isDirectory) continue;
    if (!/^\d{4}$/.exec(dirEntry.name)) continue;
    years.push(dirEntry.name);
  }
  return years.sort((a, b) => a.localeCompare(b));
}

export const getAllDaysInAYear = async (year: string) => {
  const days: Array<string> = [];
  const dir = DAYS_PATH(year);
  for await (const dirEntry of Deno.readDir(dir)) {
    days.push(dirEntry.name);
  }
  return days.sort((a, b) => a.localeCompare(b));;
}

type Options = {
    year?: string;
    day?: string;
  }

export const whichDayToRun = async (defaults: Options = { year: undefined, day: undefined }): Promise<{
  year?: string;
  day?: string;
}> => {
  const years = await getAllYears();
  const useDefaultYear = years.includes(defaults.year!);
  const selectedYear = useDefaultYear ? defaults.year as string : await Select.prompt({
    message: 'Which year do you want to run?',
    info: true,
    options: years.length > 1
      ? [
        { name: 'last', value: years.at(-1)! },
        'all',
        Select.separator("--------"),
        ...years,
      ]
      : years,
  });

  if (selectedYear === 'all') return {};

  const days = await getAllDaysInAYear(selectedYear);
  // console.log(days);
  const useDefaultDay = years.includes(defaults.year!) && days.includes(defaults.day!);
  const selectedDay = useDefaultDay ? defaults.day as string : await Select.prompt({
    message: 'Which day do you want to run?',
    info: true,
    options: days.length > 1
      ? [
        { name: 'last', value: days.at(-1)! },
        'all',
        Select.separator("--------"),
        ...days,
      ]
      : days,
  });

  if (selectedDay === 'all') return { year: selectedYear };

  return { year: selectedYear, day: selectedDay };
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