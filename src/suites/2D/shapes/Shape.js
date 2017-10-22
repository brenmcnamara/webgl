/* @flow */

import invariant from "invariant";
import nullthrows from "nullthrows";

import { IDENTITY_MATRIX, type Transform2D } from "../../Core/Transform2D";

import type Renderer from "../Renderer";

import type { Vec2 } from "../../Core/Vec2";

/**
 * The base class for drawing every shape on the canvas.
 */
export default class Shape {
  __vertices: Array<Vec2> = [];

  _children: Array<Shape> = [];
  _localTransform: Transform2D = IDENTITY_MATRIX;
  _parent: ?Shape = null;
  _renderer: ?Renderer = null;

  get parent() {
    return this._parent;
  }

  set parent(val: ?Shape) {
    if (val === this._parent) {
      // Do this to avoid incorrectly setting renderer or children when parent
      // does not change.
      return;
    }
    // TODO: Check for potential cycles before adding.
    this._parent = val;
    if (val) {
      this._renderer = val.renderer;
      this._renderer.addShape(this);
      val._children.push(this);
    } else {
      const renderer = nullthrows(this._renderer);
      renderer.removeShape(this);
      this._renderer = null;
    }
  }

  get renderer() {
    invariant(this._renderer, "Renderer not set on shape");
    return this._renderer;
  }

  set renderer(val: Renderer) {
    if (this._renderer === val) {
      return;
    }
    invariant(
      !this._parent,
      "Cannot set the renderer of a shape with a parent."
    );
    if (this._renderer) {
      this._renderer.removeShape(this);
    }
    this._renderer = val;
    this._renderer.addShape(this);
  }

  get vertices() {
    return this.__vertices;
  }

  get localTransform() {
    return this._localTransform;
  }

  set localTransform(val: Transform2D): void {
    this._invariantMutatorEnabled("transform");
    this._localTransform = val;
  }

  get children() {
    return this._children;
  }

  _invariantMutatorEnabled(propName: string): void {
    invariant(
      !this._renderer || this._renderer.mutator.enabled,
      "Cannot mutate property %s unless mutator is enabled",
      propName
    );
  }
}
