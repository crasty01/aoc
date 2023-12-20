type Comparator<T> = (first: T, second: T) => number;

export class PriorityQueue<T> {
  #items: T[];
  #compare: Comparator<T>;
  #maxSize: number;

  constructor(items?: T[], comparator?: Comparator<T>, maxSize?: number) {
    this.#maxSize = maxSize ?? 0;
    this.#items = items ?? [];
    this.#compare = comparator ?? ((first: T, second: T) => (first <= second ? -1 : 1));
    this.#heapify();
  }

  withComparator(comparator: Comparator<T>) {
    this.#compare = comparator;
    return this;
  }

  capMaxSize(maxSize: number) {
    this.#maxSize = maxSize;
    return this;
  }

  add(item: T) {
    this.#items.push(item);
    this.#heapifyUp();
    while (this.maxSize && this.size > this.maxSize) this.#items.pop();
  }
  clear() {
    this.#items = [];
  }
  peek() {
    return this.#items[0] ?? null;
  }
  remove() {
    if (this.#items.length === 0) return null;

    this.#swap(0, this.#items.length - 1);
    const head = this.#items.pop();
    this.#heapifyDown();
    return head;
  }
  get size() {
    return this.#items.length;
  }
  get maxSize() {
    return this.#maxSize;
  }
  toArray() {
    return [...this.#items];
  }
  forEachRemaining(callbackFn: (item: T) => void) {
    while (this.#items.length > 0) {
      callbackFn(this.remove()!);
    }
  }

  #heapify() {
    for (let i = Math.floor((this.#items.length - 1) / 2); i >= 0; i--) {
      this.#heapifyDown(i);
    }
  }
  #heapifyUp(i = this.#items.length - 1) {
    if (this.#hasParent(i) && this.#compare(this.#parent(i), this.#items[i]) > 0) {
      this.#swap(i, this.#parentIndex(i));
      this.#heapifyUp(this.#parentIndex(i));
    }
  }
  #heapifyDown(i = 0) {
    if (this.#hasLeftChild(i)) {
      let minIndex = i;
      if (this.#compare(this.#items[minIndex], this.#leftChild(i)) > 0) {
        minIndex = this.#leftChildIndex(i);
      }
      if (this.#hasRightChild(i) && this.#compare(this.#items[minIndex], this.#rightChild(i)) > 0) {
        minIndex = this.#rightChildIndex(i);
      }
      if (minIndex !== i) {
        this.#swap(i, minIndex);
        this.#heapifyDown(minIndex);
      }
    }
  }

  #swap(i: number, j: number) {
    const temp = this.#items[i];
    this.#items[i] = this.#items[j];
    this.#items[j] = temp;
  }

  #parent(i: number) {
    return this.#items[this.#parentIndex(i)];
  }
  #leftChild(i: number) {
    return this.#items[this.#leftChildIndex(i)];
  }
  #rightChild(i: number) {
    return this.#items[this.#rightChildIndex(i)];
  }

  #hasParent(i: number) {
    return i > 0;
  }
  #hasLeftChild(i: number) {
    return this.#leftChildIndex(i) < this.#items.length;
  }
  #hasRightChild(i: number) {
    return this.#rightChildIndex(i) < this.#items.length;
  }

  #parentIndex(i: number) {
    return Math.floor((i - 1) / 2);
  }
  #leftChildIndex(i: number) {
    return i * 2 + 1;
  }
  #rightChildIndex(i: number) {
    return i * 2 + 2;
  }
}