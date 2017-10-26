/* @flow */

import Shape from "./Shape";

import invariant from "invariant";

import { type UniformColor } from "../../Core/Color";

export default class Container extends Shape {
  __vertices = [];

  set backgroundColor(_val: UniformColor) {
    return invariant(false, "Do not set backgroundColor on a ContainerShape");
  }

  get descriptor() {
    return `ContainerShape()`;
  }
}
