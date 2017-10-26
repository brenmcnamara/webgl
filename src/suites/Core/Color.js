/* @flow */

export class UniformColor {
  _r: number;
  _g: number;
  _b: number;
  _a: number;

  static fromHex(hex: number, alpha: number = 1.0): UniformColor {
    const red = (hex & 0xff0000) / 0xff0000;
    const green = (hex & 0x00ff00) / 0x00ff00;
    const blue = (hex & 0x0000ff) / 0x0000ff;
    return new UniformColor(red, green, blue, alpha);
  }

  constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
    this._r = red;
    this._g = green;
    this._b = blue;
    this._a = alpha;
  }

  get r() {
    return this._r;
  }

  get g() {
    return this._g;
  }

  get b() {
    return this._b;
  }

  get a() {
    return this._a;
  }
}
