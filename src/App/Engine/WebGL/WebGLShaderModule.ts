import { Context } from "../Interfaces/Context";
import { ShaderModule } from "../Interfaces/ShaderModule";
import { WebGLContext } from "./WebGLContext";


export class WebGLShaderModule extends ShaderModule {
  program!: WebGLProgram;

  override Create(context: Context, vertexCode: string, fragmentCode: string): void {
    const gl = (context as WebGLContext).Context();
    const vertex = gl.createShader(gl.VERTEX_SHADER);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    const p = gl.createProgram();
    if (p === null || vertex === null || fragment === null) {
      throw new Error(
        `WebGLShaderModule: Create() -> Failed to create ${p === null ? "WebGLProgram" : ''}`+
        `${vertex === null ? ", VertexShader" : ""}${fragment === null ? ", FragmentShader" : ""}`);
    }
    gl.shaderSource(vertex, vertexCode);
    gl.compileShader(vertex);
    gl.shaderSource(fragment, fragmentCode);
    gl.compileShader(fragment);
    this.program = p;
    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, fragment);
    gl.linkProgram(this.program);
    gl.validateProgram(this.program);
  }

  Bind(context: Context) {
    (context as WebGLContext).Context().useProgram(this.program);
  }

  Unbind(context: Context) {
    (context as WebGLContext).Context().useProgram(null);
  }
}