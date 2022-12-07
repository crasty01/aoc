import Tree from './Tree.ts';

type ChangeDirectoryCommand = {
  type: 'cd';
  value: string; // path
};
type ListCommand = {
  type: 'ls';
};
type Directory = {
  type: 'dir';
  value: string; // name
};
type File = {
  type: 'file';
  value: string; // name
  size: number; // size
};
type Line = ListCommand | ChangeDirectoryCommand | File | Directory;
type Input = Array<Line>;

const createChangeDirectoryCommand = (value: string): ChangeDirectoryCommand => ({
  type: 'cd',
  value,
});
const createListCommand = (): ListCommand => ({
  type: 'ls',
});
const createDirectory = (value: string): Directory => ({
  type: 'dir',
  value,
});
const createFile = (size: number, value: string): File => ({
  type: 'file',
  value,
  size,
});

const parseLine = (line: string): Line => {
  const isCommand = line.charAt(0) === '$';
  const parts = line.split(' ').slice(isCommand ? 1 : 0);
  if (isCommand && parts[0] === 'cd') return createChangeDirectoryCommand(parts[1]);
  if (isCommand && parts[0] === 'ls') return createListCommand();
  if (!isCommand && parts[0] === 'dir') return createDirectory(parts[1]);
  return createFile(parseInt(parts[0], 10), parts[1]);
}

export const parseInput = (rawInut: string): Input => {
  return rawInut.split('\r\n').map(parseLine);
}

const solution = (input: Input): Tree => {
  const root = new Tree('/');
  let currentPath: Array<string> = [];

  for (const line of input) {
    switch (line.type) {
      case 'cd':
        if (line.value === '/') currentPath = ['/'];
        else if (line.value === '..') currentPath = currentPath.slice(0, -1);
        else currentPath = [...currentPath, line.value];
        break;
      case 'ls': break;
      case 'dir':
        root.addDirectory(currentPath, line.value);
        break;
      case 'file':
        root.addFile(currentPath, line.value, line.size);
        break;
    }
  }

  return root;
}

export const solution1 = (input: Input): number | string =>  {
  const MAX = 100_000;

  const root = solution(input);
  const allDirs = [root, ...root.getAllSubdirectories(true)];
  const filteredDirs = allDirs.filter(dir => dir.size <= MAX);
  const sumOfFilteredDirsSizes = filteredDirs.reduce((sum, dir) => sum + dir.size, 0);

  return sumOfFilteredDirsSizes;
}

export const solution2 = (input: Input): number | string =>  {
  const TOTAL = 70_000_000;
  const NEEDED = 30_000_000;

  const root = solution(input);
  const currentSize = root.size;
  const toRemove = currentSize - ( TOTAL - NEEDED );
  const allDirs = [root, ...root.getAllSubdirectories(true)];
  const dirToRemove = allDirs
    .sort((a, b) => a.size - b.size)
    .find(dir => dir.size > toRemove);

  if (!dirToRemove) throw new Error("No corresponding directory found!");
  return dirToRemove.size;
}