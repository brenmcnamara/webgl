/* @flow */

import invariant from "invariant";

import { getDescriptor as getVec2Descriptor, type Vec2 } from "../../Core/Vec2";
import {
  IDENTITY_MATRIX,
  multiply,
  type Transform2D,
} from "../../Core/Transform2D";
import { UniformColor } from "../../Core/Color";

import type Renderer from "../Renderer";

/**
 * The base class for drawing every shape on the canvas.
 */
export default class Shape {
  __vertices: Array<Vec2> = [];

  _backgroundColor: UniformColor = UniformColor.fromHex(0x000000, 0.0);
  _children: Array<Shape> = [];
  _localTransform: Transform2D = IDENTITY_MATRIX;
  _parent: ?Shape = null;
  _renderer: ?Renderer = null;

  get parent() {
    return this._parent;
  }

  set parent(parent: ?Shape) {
    if (parent === this._parent) {
      return;
    }

    // Invariant Checks.
    invariant(
      this._parent || !parent || parent._renderer || !this._renderer,
      "Do not set the renderer of a child shape before its parent"
    );
    invariant(
      this._parent ||
        !parent ||
        !parent._renderer ||
        !this._renderer ||
        parent._renderer === this._renderer,
      "Do not set a parent shape with a different renderer than its children"
    );
    // TODO: Check for cycles.

    // EDGE CASE: The shape already has a parent and we are changing the parent.
    // Must make sure that the children are un-set on the other parent and the
    // renderer is changed.
    if (this._parent) {
      const parent = this._parent;
      const indexOfSelf = this._parent._children.indexOf(this);
      invariant(
        indexOfSelf >= 0,
        "Cannot find child shape in list of its parent"
      );
      parent._children.splice(indexOfSelf, 1);
    }
    this._parent = null;
    // EDGE CASE: The shape already has a parent and we are setting its parent
    // to null.
    if (!parent) {
      return;
    }

    if (parent._renderer) {
      // This must be done before setting the parent.
      this.renderer = parent._renderer;
    }
    this._parent = parent;
    parent._children.push(this);
  }

  get renderer() {
    invariant(this._renderer, "Renderer not set on shape");
    return this._renderer;
  }

  set renderer(val: Renderer) {
    if (this._renderer === val) {
      return;
    }

    // Invariant checks.
    invariant(
      !this._parent,
      "Do not set the renderer of a shape with a parent."
    );

    // Set the renderer of self and all descendants.
    const descendants: Array<Shape> = [];
    let next: ?Shape = this;
    while (next) {
      if (next._renderer) {
        next._renderer.removeShape(next);
      }
      next._renderer = val;
      next._renderer.addShape(next);
      descendants.push.apply(descendants, next._children);
      next = descendants.pop();
    }
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  set backgroundColor(val: UniformColor) {
    this._invariantMutatorEnabled("backgroundColor");
    this._backgroundColor = val;
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

  get transform() {
    // TODO: Cache this.
    const ancestors: Array<Shape> = [this];
    let nextAncestor = this._parent;
    while (nextAncestor) {
      ancestors.push(nextAncestor);
      nextAncestor = nextAncestor._parent;
    }

    let productMatrix = IDENTITY_MATRIX;
    for (let i = ancestors.length - 1; i >= 0; --i) {
      const nextMatrix = ancestors[i].localTransform;
      if (nextMatrix !== IDENTITY_MATRIX) {
        productMatrix = multiply(productMatrix, nextMatrix);
      }
    }
    return productMatrix;
  }

  get children() {
    return this._children;
  }

  get descriptor() {
    const points = this.__vertices.map(getVec2Descriptor).join(", ");
    const ctorName = this.constructor.name;
    return `${ctorName}([${points}])`;
  }

  _invariantMutatorEnabled(propName: string): void {
    invariant(
      !this._renderer || this._renderer.mutator.isEnabled,
      `Cannot mutate property "%s" unless mutator is enabled`,
      propName
    );
  }
}
