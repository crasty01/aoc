import { colors } from 'cliffy/ansi/colors.ts';

export default class Directory {
  #directories: Array<Directory>;
  #files: Array<File>;
  #parent: Directory;
  #root: Directory;
  #size: number;
  #name: string;
  #level: number;

  constructor(name: string, parent?: Directory, root?: Directory) {
    this.#name = name;

    this.#parent = parent ?? this;
    this.#root = root ?? this;
    this.#level = parent ? parent.#level + 1 : 0;
    this.#size = 0;
    this.#directories = [];
    this.#files = [];
  }

  public get size(): number {
    return this.#size;
  }

  public get name(): string {
    return this.#name;
  }

  private findDirectory(name: string): Directory {
    const dir = this.#directories.find((node) => node.name === name);
    if (!dir) throw new Error('No such directory exists!');
    return dir;
  }

  public addDirectory(path: Array<string>, name: string): Directory {
    const [currentName, ...nextPath] = path;
    if (currentName !== this.#name) throw new Error('Something went wrong!');

    if (nextPath.length > 0) {
      return this.findDirectory(nextPath[0]).addDirectory(nextPath, name);
    }

    const instance = new Directory(name, this, this.#root);
    this.#directories.push(instance);

    return this.#parent;
  }

  public addFile(path: Array<string>, name: string, size: number): Directory {
    this.#size += size;

    const [currentName, ...nextPath] = path;
    if (currentName !== this.#name) throw new Error('Something went wrong!');

    if (nextPath.length > 0) {
      return this.findDirectory(nextPath[0]).addFile(nextPath, name, size);
    }

    const instance = new File(name, size, this, this.#root);
    this.#files.push(instance);

    return this.#parent;
  }

  public getAllSubdirectories(recursive: boolean): Array<Directory> {
    let dirs: Array<Directory> = [];
    for (const dir of this.#directories) {
      dirs.push(dir);
      if (!recursive) continue;
      dirs = dirs.concat(...dir.getAllSubdirectories(recursive));
    }
    return dirs;
  }

  public toString(maxLevel = Infinity, showFiles = true, indent = true): string {
    const res = [];
    const indentation = indent ? '  '.repeat(this.#level) : '';
    res.push(colors.brightBlue(`${indentation}${this.#level > 0 ? '+-- ' : ''}Dir ${this.name}  ${this.size} bite`));
    if (showFiles) {
      for (const file of this.#files) {
        res.push(colors.brightGreen(`${indentation}  +-- File ${file.name}  ${file.size} bite`))
      }
    }
    if (this.#level < maxLevel) {
      for (const dir of this.#directories) {
        res.push(dir.toString(maxLevel, showFiles, indent))
      }
    }
    return res.join('\n');
  }
}

class File {
  size: number | undefined;
  name: string;

  #parent: Directory;
  #root: Directory;

  constructor(name: string, size: number, parent: Directory, root: Directory) {
    this.name = name;
    this.size = size;

    this.#parent = parent;
    this.#root = root;
  }
}

/* // Test
const tree = new Directory('/');

const randomString = (length = 6): string => {
  let string = '';
  for (let i = 0; i < length; i++) {
    string += String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  }
  return string
}

const names = Array.from({ length: 12 }, () => randomString());

tree.addFile(['/'], names[0], 10);
tree.addFile(['/'], names[1], 10);

tree.addDirectory(['/'], names[2]);

tree.addFile(['/', names[2]], names[3], 10);
tree.addFile(['/', names[2]], names[4], 10);

tree.addDirectory(['/', names[2]], names[5]);

tree.addFile(['/', names[2], names[5]], names[6], 10);
tree.addFile(['/', names[2], names[5]], names[7], 10);

tree.addDirectory(['/'], names[8]);

tree.addFile(['/', names[8]], names[9], 10);
tree.addFile(['/', names[8]], names[9], 10);

console.log(tree.toString());
*/