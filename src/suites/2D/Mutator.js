/* @flow */

import invariant from "invariant";

export type MutationContext = {};

/**
 * Coordinates any mutation to shapes. Before shapes can be
 * mutated.
 */
export default class Mutator {
  _hasMutations: bool = false;
  _stack: Array<MutationContext> = [];

  get isEnabled() {
    return this._stack.length > 0;
  }

  pushContext(context: MutationContext): void {
    this._stack.push(context);
  }

  popContext(): void {
    invariant(
      this._stack.length > 0,
      "Cannot pop Mutator context. Stack is empty"
    );
    this._stack.pop();
  }
}
