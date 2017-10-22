/* @flow */

import Suite2D from "./suites/2D/index";

import invariant from "invariant";

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
  const rect1 = new Suite2D.Shapes.Rectangle();
  rect1.localTransform = rotate(rect1.localTransform, Math.PI / 4);
  rect1.localTransform = translate(rect1.localTransform, 300, 0);
  rect1.localTransform = scale(rect1.localTransform, 30, 30);

  const tri = new Suite2D.Shapes.Triangle();
  tri.localTransform = translate(tri.localTransform, 100, 100);
  tri.localTransform = scale(tri.localTransform, 100, 100);

  rect1.renderer = renderer;
  tri.renderer = renderer;
  renderer.render(window.innerWidth, window.innerHeight);

  window.onresize = () => {
    renderer.render(window.innerWidth, window.innerHeight);
  };
}

window.onload = main;
