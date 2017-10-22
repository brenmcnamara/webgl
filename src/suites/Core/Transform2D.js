/* @flow */

import { Vec2 } from "./Vec2";

export type Transform2D = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const IDENTITY_MATRIX = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export function transformVertex(point: Vec2, transform: Transform2D): Vec2 {
  return {
    x: point.x * transform[0] + point.y * transform[1] + transform[2],
    y: point.x * transform[3] + point.y * transform[4] + transform[5],
  };
}

export function multiply(f: Transform2D, s: Transform2D): Transform2D {
  return [
    f[0] * s[0] + f[1] * s[3] + f[2] * s[6],
    f[0] * s[1] + f[1] * s[4] + f[2] * s[7],
    f[0] * s[2] + f[1] * s[5] + f[2] * s[8],
    f[3] * s[0] + f[4] * s[3] + f[5] * s[6],
    f[3] * s[1] + f[4] * s[4] + f[5] * s[7],
    f[3] * s[2] + f[4] * s[5] + f[5] * s[8],
    f[6] * s[0] + f[7] * s[3] + f[8] * s[6],
    f[6] * s[1] + f[7] * s[4] + f[8] * s[7],
    f[6] * s[2] + f[7] * s[5] + f[8] * s[8],
  ];
}

export function translate(
  current: Transform2D,
  translateX: number,
  translateY: number
): Transform2D {
  const transform = [1, 0, translateX, 0, 1, translateY, 0, 0, 1];
  return multiply(current, transform);
}

export function scale(
  current: Transform2D,
  scaleX: number,
  scaleY: number
): Transform2D {
  const transform = [scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1];
  return multiply(current, transform);
}

export function rotate(current: Transform2D, radians: number): Transform2D {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const transform = [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
  return multiply(current, transform);
}
