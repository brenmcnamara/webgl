/* @flow */

export type Vec2 = {
  x: number,
  y: number,
};

export function getDescriptor(vec2: Vec2): string {
  return `{x: ${vec2.x}, y: ${vec2.y}}`;
}
