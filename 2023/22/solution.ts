type Tripple = [number, number, number];
type Unpacked<T> = T extends (infer U)[] ? U : T;
type Mapper<T, U> = (t: T) => U;
type Predicate<T> = Mapper<T, boolean>;

const range = (start: number, length: number) =>
  Array.from({ length }, (_, i) => i + start);

const groupByLowestPoint = (bricks: Array<Brick>) => {
  const acc: Array<Array<Brick> | undefined> = [];
  for (const brick of bricks) {
    const z = brick.getLowestPoint().z;

    if (acc[z] === undefined) {
      acc[z] = [];
    }

    acc[z].push(brick);
  }

  return acc;
};

const dropBricks = (bricks: Array<Brick>): Array<Brick> => {
  const settledBricks: Array<Brick> = [];
  const _fallingBricks: Array<Brick> = [];

  for (const brick of bricks) {
    brick.isTouchingGround()
      ? settledBricks.push(brick)
      : _fallingBricks.push(brick);
  }

  const fallingBricks = groupByLowestPoint(_fallingBricks);
  const fallDelta = Point3D.for(0, 0, -1);

  while (fallingBricks.length > 0) {
    const currentZ = fallingBricks.shift();
    if (!currentZ) continue;

    while (currentZ.length > 0) {
      const cur = currentZ.shift()!;

      if (
        cur.isTouchingGround() || settledBricks.some((b) => b.isSupporting(cur))
      ) {
        settledBricks.unshift(cur);
        continue;
      }

      const { head, tail } = cur;
      const [newH, newT] = [head, tail].map((p) => p.add(fallDelta));
      const newBrick = new Brick(newH, newT);
      currentZ.push(newBrick);
    }

    if (currentZ.length > 0) {
      fallingBricks.unshift(currentZ);
    }
  }

  return settledBricks;
};

const countSafeToDisentigrateBricks = (bricks: Array<Brick>): number => {
  const grouped = groupByLowestPoint(bricks);

  const supportedByMap = new Map<Brick, Set<Brick>>();
  const supportsMap = new Map<Brick, Set<Brick>>();

  for (const bricks of grouped) {
    if (!bricks) continue;
    for (const cur of bricks) {
      const top = cur.getHighestPoint().z;
      const toCheck = grouped.filter((g, i) =>
        i > top && g !== null && g !== undefined
      ).flat() as Exclude<Unpacked<typeof grouped>, undefined>;

      for (const above of toCheck) {
        if (!cur.isSupporting(above)) {
          continue;
        }

        if (!supportedByMap.has(above)) {
          supportedByMap.set(above, new Set([cur]));
        } else {
          supportedByMap.get(above)!.add(cur);
        }

        if (!supportsMap.has(cur)) {
          supportsMap.set(cur, new Set([above]));
        } else {
          supportsMap.get(cur)!.add(above);
        }
      }
    }
  }

  const yeetable = bricks.filter((b) => {
    const supports = supportsMap.get(b);
    if (supports === undefined) {
      return true;
    }

    if ([...supports].every((child) => supportedByMap.get(child)!.size > 1)) {
      return true;
    }

    return false;
  });

  return yeetable.length;
};

const countWouldFallOnDisentigrate = (bricks: Array<Brick>): number => {
  const grouped = groupByLowestPoint(bricks);

  const supportedByMap = new Map<Brick, Set<Brick>>();
  const supportsMap = new Map<Brick, Set<Brick>>();

  console.log("building support trees");

  for (const bricks of grouped) {
    if (!bricks) continue;
    for (const cur of bricks) {
      const top = cur.getHighestPoint().z;
      const toCheck = grouped.filter((g, i) =>
        i > top && g !== null && g !== undefined
      ).flat() as Exclude<Unpacked<typeof grouped>, undefined>;

      for (const above of toCheck) {
        if (!cur.isSupporting(above)) {
          continue;
        }

        if (!supportedByMap.has(above)) {
          supportedByMap.set(above, new Set([cur]));
        } else {
          supportedByMap.get(above)!.add(cur);
        }

        if (!supportsMap.has(cur)) {
          supportsMap.set(cur, new Set([above]));
        } else {
          supportsMap.get(cur)!.add(above);
        }
      }
    }
  }

  console.log("done");
  console.log("finding candidates...");

  const worthConsidering = bricks.filter((b) => {
    const supports = supportsMap.get(b);
    if (
      supports === undefined ||
      [...supports].every((child) => supportedByMap.get(child)!.size > 1)
    ) {
      return false;
    }

    return true;
  });

  console.log(worthConsidering.length, "candidates, determining results");

  const numFalls = worthConsidering.map((yeeten, i) => {
    if (i % 100 == 0) {
      console.log("examining candidate", i, "of", worthConsidering.length);
    }

    const fallen = new Set<Brick>();

    fallen.add(yeeten);

    const toCheck = new PriorityQueue<Brick>(
      (b) => b.getLowestPoint().z,
      supportsMap.get(yeeten)!,
    );

    while (toCheck.length > 0) {
      const cur = toCheck.popFirst()!;

      const supporters = supportedByMap.get(cur)!;

      if (supporters.size <= 1 || [...supporters].every((s) => fallen.has(s))) {
        fallen.add(cur);

        const supported = supportsMap.get(cur);
        if (supported) {
          supported.forEach((b) => toCheck.add(b));
        }
      }
    }

    console.log("candidate done,", fallen.size - 1, "fallen");

    return fallen.size - 1;
  });

  let sum = 0;

  for (const num of numFalls) {
    sum += num;
  }

  return sum;
};

class PriorityQueue<T> {
  #inner: Array<[number, T]>;
  #mapper: Mapper<T, number>;

  constructor(mapper: Mapper<T, number>, items?: Iterable<T>) {
    this.#inner = [];
    this.#mapper = mapper;
    if (items) {
      for (const item of items) this.add(item);
    }
  }

  add(item: T, mapperOrPrio?: Mapper<T, number> | number) {
    const mapper = typeof mapperOrPrio === "function"
      ? mapperOrPrio
      : this.#mapper;
    const prio = typeof mapperOrPrio === "number" ? mapperOrPrio : mapper(item);
    const insertLoc = this.#inner.findLastIndex(([p, _]) => p <= prio) + 1;
    this.#inner.splice(insertLoc, 0, [prio, item]);
  }

  filter(pred: Predicate<T>): PriorityQueue<T> {
    const ret = new PriorityQueue(this.#mapper);

    for (let i = 0; i < this.#inner.length; i++) {
      if (pred(this.#inner[i][1])) ret.add(this.#inner[i][1], () => i);
    }

    return ret;
  }

  filterInPlace(pred: Predicate<T>): void {
    this.#inner = this.#inner.filter(([_, e]) => pred(e));
  }

  popFirst(): T | undefined {
    return this.#inner.shift()?.[1];
  }

  some(pred: Predicate<T>): boolean {
    return this.#inner.some(([_, e]) => pred(e));
  }

  get length() {
    return this.#inner.length;
  }

  [Symbol.for("Deno.customInspect")]() {
    return Deno.inspect(this.#inner);
  }
}

class Point3D {
  static store: Map<string, Point3D> = new Map();

  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static for(x: number, y: number, z: number): Point3D {
    const key = [x, y, z].join("-");
    if (!Point3D.store.has(key)) {
      Point3D.store.set(key, new Point3D(x, y, z));
    }
    return Point3D.store.get(key)!;
  }

  toString() {
    return `Point3D {x: ${this.x}, y: ${this.y}, z: ${this.z}}`;
  }

  add(point: Point3D | Tripple): Point3D {
    const [x, y, z] = Array.isArray(point)
      ? point
      : [point.x, point.y, point.z];
    return Point3D.for(this.x + x, this.y + y, this.z + z);
  }
}

class Brick {
  body: Array<Point3D>;
  allPoints: Set<Point3D>;
  head: Point3D;
  tail: Point3D;

  constructor(head: Point3D, tail: Point3D) {
    this.head = head;
    this.tail = tail;

    if (head === tail) {
      this.body = [];
      this.allPoints = new Set([head]);
    } else {
      for (const axis of ["x", "y", "z"] as const) {
        const h = head[axis];
        const t = tail[axis];

        if (h !== t) {
          this.allPoints = new Set();
          this.allPoints.add(head);

          const [low, high] = h > t ? [t, h] : [h, t];
          this.body = range(low + 1, high - (low + 1)).map((n) => {
            const { x, y, z } = head;
            const proto = { x, y, z };
            proto[axis] = n;
            const p = Point3D.for(proto.x, proto.y, proto.z);
            this.allPoints.add(p);
            return p;
          });

          this.allPoints.add(tail);

          return;
        }
      }
      throw new Error(`invalid brick: ${head} ~ ${tail}`);
    }
  }

  isTouchingGround(): boolean {
    return this.head.z === 1 || this.tail.z === 1;
  }

  getLowestPoint(): Point3D {
    return this.head.z < this.tail.z ? this.head : this.tail;
  }

  getHighestPoint(): Point3D {
    return this.head.z > this.tail.z ? this.head : this.tail;
  }

  contains(p: Point3D): boolean {
    return this.allPoints.has(p);
  }

  isSupporting(other: Brick): boolean {
    return [...this.allPoints].some((p) => other.contains(p.add([0, 0, 1])));
  }

  intersectsWith(other: Brick): boolean {
    for (const point of other.allPoints) {
      if (this.allPoints.has(point)) {
        return true;
      }
    }
    return false;
  }
}

type Input = Array<Brick>;
export const solutions: Array<
  (input: Input, run?: boolean) => number | string
> = [];
export const parseInput = (rawInut: string): Input => {
  return rawInut.split(/\r?\n/g).map((line) => {
    const [head, tail] = line.split("~").map((p) =>
      Point3D.for(...p.split(",").map((e) => parseInt(e)) as Tripple)
    );
    return new Brick(head, tail);
  });
};

solutions[0] = (input: Input, run = false): number => {
  if (!run) return -1;

  const settled = dropBricks(input);
  const safeToDis = countSafeToDisentigrateBricks(settled);

  return safeToDis;
};

solutions[1] = (input: Input, run = false): number => {
  // if (!run) return -1;

  const settled = dropBricks(input);

  return countWouldFallOnDisentigrate(settled);
};

const example = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

console.log("example:", solutions[0](parseInput(example), true));
