export default class BitArray {
  #bits: Uint8Array;
  #length: number;
  #size = 8;

  constructor(length: number) {
    this.#bits = new Uint8Array(Math.ceil(length / this.#size));
    this.#length = length;
  }
  
  get length() {
    return this.#length;
  }

  get bits() {
    return this.#bits;
  }

  get(index: number) {
    if (index < 0 || index >= this.#length) throw new Error("Index out of range");

    const i = Math.floor(index / this.#size);
    const j = index % this.#size;
    return (this.#bits[i] & (1 << j)) !== 0;
  }

  set(index: number, value: boolean | 0 | 1) {
    if (index < 0 || index >= this.#length) throw new Error("Index out of range");

    const i = Math.floor(index / this.#size);
    const j = index % this.#size;
    if (value) {
      this.#bits[i] |= 1 << j;
    } else {
      this.#bits[i] &= ~(1 << j);
    }
  }
}
