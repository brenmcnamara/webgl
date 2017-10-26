/* @flow */

import Container from "./shapes/Container";
import Mutator from "./Mutator";
import Renderer from "./Renderer";
import Rectangle from "./shapes/Rectangle";
import Triangle from "./shapes/Triangle";

export default {
  Mutator,
  Renderer,
  Shape: {
    Container,
    Rectangle,
    Triangle,
  },
};
