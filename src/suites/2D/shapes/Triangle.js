/* @flow */

import Shape from "./Shape";

const RAD_3 = Math.sqrt(3);

export default class Triangle extends Shape {
  __vertices = [
    { x: 0, y: 1 / RAD_3 },
    { x: -0.5, y: -1 / (2 * RAD_3) },
    { x: 0.5, y: -1 / (2 * RAD_3) },
  ];
}
