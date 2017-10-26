/* @flow */

import Suite2D from "./suites/2D/index";

import invariant from "invariant";

import { UniformColor } from "./suites/Core/Color";

import { rotate, scale, translate } from "./suites/Core/Transform2D";

function main() {
  // $FlowFixMe - This is a canvas element.
  const canvas: ?HTMLCanvasElement = document.getElementById("canvas");
  invariant(canvas, "Canvas element is missing");
  const mutator = new Suite2D.Mutator();
  const renderer = new Suite2D.Renderer(canvas, mutator);
  if (!renderer.initialize()) {
    // eslint-disable-next-line no-console
    console.warn("Failed to initialize renderer.");
    return;
  }
  const container = new Suite2D.Shape.Container();

  const rect1 = new Suite2D.Shape.Rectangle();
  rect1.backgroundColor = UniformColor.fromHex(0xff00ff);
  rect1.localTransform = rotate(rect1.localTransform, Math.PI / 4);
  rect1.localTransform = translate(rect1.localTransform, 300, 0);
  rect1.localTransform = scale(rect1.localTransform, 30, 30);
  rect1.parent = container;

  window.rect = rect1;
  window.container = container;

  container.renderer = renderer;
  renderer.render(window.innerWidth, window.innerHeight);

  window.onresize = () => {
    renderer.render(window.innerWidth, window.innerHeight);
  };
}

window.onload = main;
