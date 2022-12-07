import {
  getAllYears,
  getAllDaysInAYear,
} from '/src/functions/print.ts';
import { join } from 'std/path/mod.ts';
import { ensureDir } from 'std/fs/mod.ts';

for (const year of await getAllYears()) {
  for (const day of await getAllDaysInAYear(year)) {
    await ensureDir(join(Deno.cwd(), year, day));
    Deno.rename(join(Deno.cwd(), year, `${day}.ts`), join(Deno.cwd(), year, day, `solution.ts`));
    Deno.rename(join(Deno.cwd(), year, `${day}.txt`), join(Deno.cwd(), year, day, `input.txt`));
  }
}