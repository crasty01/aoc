import { Cell, CellType, Grid } from "./Grid.ts";

type Input = {
	grid: Grid;
	crossroads: Array<Cell>;
	nodes: Map<number, Node>;
	start: Cell;
	end: Cell;
}
type Node = {
  cell: Cell;
  paths: Map<number, number>;
};

const find_longest_path = (
  start_id: number,
  end_id: number,
  nodes: Map<number, Node>,
	use_difficult = false,
): number => {
  let longest_path = 0;

  function dfs(
    current_id: number,
    end_id: number,
    visited: Set<number>,
    current_length: number,
  ): void {
    if (current_id === end_id) {
      if (current_length > longest_path) {
        longest_path = current_length;
      }
      return;
    }

    visited.add(current_id);

    const current_node = nodes.get(current_id);
    if (current_node) {
      for (const [next_id, distance] of current_node.paths.entries()) {
        if (!visited.has(next_id) && (use_difficult ? true : distance >= 0)) {
          dfs(next_id, end_id, visited, current_length + Math.abs(distance));
        }
      }
    }

    visited.delete(current_id);
  }

  dfs(start_id, end_id, new Set<number>(), 0);

  return longest_path;
};

export const solutions: Array<
  (input: Input, run?: boolean) => number | string
> = [];
export const parseInput = (rawInut: string): Input => {
  const parsed: Array<Array<CellType>> = rawInut.split(/\r?\n/).map((e) =>
    e.trim().split("") as Array<CellType>
  );
  const WIDTH = parsed[0].length;
  const HEIGHT = parsed.length;

  const grid = new Grid(HEIGHT, WIDTH, (x, y) => parsed[y][x]);

  const crossroads = grid.filterCells((cell) => {
    return cell.type !== "#" &&
      cell.neighbours.filter((neighbour) => neighbour.type !== "#").length >= 3;
  });

  const start = grid.getRow(0).find((e) => e.type !== "#");
  const end = grid.getRow(HEIGHT - 1).find((e) => e.type !== "#");

  if (start === undefined || end === undefined) {
    throw new Error("No start or end found");
  }

  const nodes = new Map<number, Node>();
  const list = [start, ...crossroads, end];
  const node_indexes = list.map((e) => e.index);
  const is_node = (index: number): boolean =>
    node_indexes.indexOf(index) !== -1;
  const is_valid_direction = (current: Cell, next: Cell): boolean => {
    if (current.type === ".") return true;
    if (
      current.type === "<" && current.y === next.y && current.x - 1 === next.x
    ) return true;
    if (
      current.type === ">" && current.y === next.y && current.x + 1 === next.x
    ) return true;
    if (
      current.type === "v" && current.x === next.x && current.y + 1 === next.y
    ) return true;
    if (
      current.type === "^" && current.x === next.x && current.y - 1 === next.y
    ) return true;

    return false;
  };

  for (let i = 0; i < list.length; i++) {
    const neighbours = list[i].neighbours.filter((e) => e.type !== "#");
    const node: Node = {
      cell: list[i],
      paths: new Map(),
    };

    for (let j = 0; j < neighbours.length; j++) {
      let path_length = 1;
      let last = list[i];
      let current = neighbours[j];
			let is_difficult = false;

      while (is_node(current.index) === false) {
        const next = current.neighbours.filter((e) =>
          e.type !== "#" && e.index !== last.index
        );
        if (next.length !== 1) {
          throw new Error("multiple or no option for next cell in path");
        }

        if (!is_valid_direction(current, next[0])) {
					is_difficult = true;
				}

        last = current;
        current = next[0];
        path_length++;
      }

      if (is_node(current.index)) node.paths.set(current.index, path_length * (is_difficult ? -1 : 1));
    }

    nodes.set(node.cell.index, node);
  }

  // console.log(nodes);

  return {
    grid,
    crossroads,
		nodes,
		start,
		end,
  };
};

solutions[0] = (input: Input, run = false): number => {
  // if (!run) return -1;
	return find_longest_path(input.start.index, input.end.index, input.nodes);
};

solutions[1] = (input: Input, run = false): number => {
  // if (!run) return -1;
	return find_longest_path(input.start.index, input.end.index, input.nodes, true);
};

const example = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`;

console.log("example:", solutions[0](parseInput(example), true));
