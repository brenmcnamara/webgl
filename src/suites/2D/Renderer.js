/* @flow */

import UniformFS from "../Core/shaders/uniform.fs.glsl";
import UniformVS from "../Core/shaders/uniform.vs.glsl";

import invariant from "invariant";

import { transformVertex } from "../Core/Transform2D";

import type Mutator from "./Mutator";
import type Shape from "./shapes/Shape";

export type ShaderSource = string;
export type ShaderVariableLocation = number;

type ShapeMetadata = {
  attributeLocations: { [attribute: Attribute]: number },
  program: WebGLProgram,
  uniformLocations: { [attribute: Attribute]: WebGLUniformLocation },
};

const ATTRIBUTES = {
  a_position: "a_position",
};

const UNIFORMS = {
  u_color: "u_color",
  u_resolution: "u_resolution",
};

export type Attribute = $Keys<typeof ATTRIBUTES>;
export type Uniform = $Keys<typeof UNIFORMS>;

/**
 * Performs all the rendering to the canvas. Register shapes with the Renderer
 * and the renderer will be in charge of rendering them to the screen.
 */
export default class Renderer {
  _canvas: HTMLCanvasElement;
  _gl: ?WebGLRenderingContext = null;
  _height: number = 0;
  _mutator: Mutator;
  _shapes: Array<Shape> = [];
  _shapesMetadata: Array<ShapeMetadata> = [];
  _width: number = 0;

  constructor(canvas: HTMLCanvasElement, mutator: Mutator) {
    this._canvas = canvas;
    this._mutator = mutator;
  }

  get mutator() {
    return this._mutator;
  }

  /**
   * Try to initialize the renderer. If it fails, this will return false.
   */
  initialize(): bool {
    const gl = this._canvas.getContext("webgl");
    if (!gl) {
      return false;
    }
    this._gl = gl;
    return true;
  }

  /**
   * Render the currently-registered shapes.
   */
  render(width: number, height: number): void {
    invariant(
      !this._mutator.isEnabled,
      "Mutations must be complete before rendering"
    );
    const context = this._getContext();

    // Update dimensions.
    this._width = width;
    this._height = height;
    this._canvas.width = width.toString();
    this._canvas.height = height.toString();
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;

    // Clear canvas.
    context.viewport(0, 0, width, height);
    context.clearColor(0, 0, 0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    // Render shapes.
    this._shapes.forEach((shape, index) => {
      if (shape.vertices.length === 0) {
        return;
      }

      const {
        attributeLocations,
        program,
        uniformLocations,
      } = this._shapesMetadata[index];

      context.useProgram(program);

      const { backgroundColor } = shape;

      // Set uniforms
      context.uniform2f(uniformLocations.u_resolution, width, height);
      context.uniform4f(
        uniformLocations.u_color,
        backgroundColor.r,
        backgroundColor.g,
        backgroundColor.b,
        backgroundColor.a
      );

      // Set Vertices
      const flattenVertices = new Float32Array(shape.vertices.length * 2);
      shape.vertices.forEach((vertex, ii) => {
        const { x, y } = transformVertex(vertex, shape.localTransform);
        flattenVertices.set([x, y], ii * 2);
      });
      const vertexBuffer = context.createBuffer();
      context.enableVertexAttribArray(attributeLocations.a_position);
      context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
      context.bufferData(
        context.ARRAY_BUFFER,
        flattenVertices,
        context.STATIC_DRAW
      );
      context.vertexAttribPointer(
        attributeLocations.a_position,
        2, // size
        context.FLOAT,
        false, // normalize
        0, // stride
        0 // offset
      );
      context.drawArrays(context.TRIANGLES, 0, shape.vertices.length);
    });
  }

  addShape(shape: Shape): void {
    const context = this._getContext();
    const vertexShader = this._createShader(context.VERTEX_SHADER, UniformVS);
    const fragShader = this._createShader(context.FRAGMENT_SHADER, UniformFS);
    const program = this._createProgram(vertexShader, fragShader);
    this._shapes.push(shape);
    this._shapesMetadata.push({
      attributeLocations: {
        a_position: context.getAttribLocation(program, "a_position"),
      },
      program,
      uniformLocations: {
        u_color: context.getUniformLocation(program, "u_color"),
        u_resolution: context.getUniformLocation(program, "u_resolution"),
      },
    });
  }

  removeShape(shape: Shape): void {
    const index = this._shapes.indexOf(shape);
    invariant(
      index >= 0,
      "Trying to remove shape from renderer that does not exist"
    );
    this._shapes.slice(index, 1);
    this._shapesMetadata(index, 1);
  }

  _getContext(): WebGLRenderingContext {
    invariant(
      this._gl,
      "Cannot render until renderer has been successfully initialized"
    );
    return this._gl;
  }

  _createShader(type: number, source: ShaderSource): WebGLShader {
    const context = this._getContext();
    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    const success = context.getShaderParameter(shader, context.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    // eslint-disable-next-line no-console
    const log = context.getShaderInfoLog(shader);
    context.deleteShader(shader);
    return invariant(false, "Shader compiler failure: %s", log);
  }

  _createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLFragmentShader
  ): WebGLProgram {
    const context = this._getContext();
    const program = context.createProgram();
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    const success = context.getProgramParameter(program, context.LINK_STATUS);
    if (success) {
      return program;
    }
    const log = context.getProgramInfoLog(program);
    context.deleteProgram(program);
    return invariant(false, "Shader program linker failure: %s", log);
  }
}
