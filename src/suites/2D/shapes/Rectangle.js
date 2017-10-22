/* @flow */

import Shape from "./Shape";

export default class Rectangle extends Shape {
  __vertices = [
    // Tri 1.
    { x: -0.5, y: +0.5 },
    { x: +0.5, y: +0.5 },
    { x: +0.5, y: -0.5 },
    // Tri 2.
    { x: +0.5, y: -0.5 },
    { x: -0.5, y: -0.5 },
    { x: -0.5, y: +0.5 },
  ];
}
