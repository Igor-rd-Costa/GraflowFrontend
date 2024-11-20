import { BufferType, Buffer } from "../Interfaces/Buffer";
import { CommandBuffer } from "../Interfaces/CommandBuffer";
import { Context } from "../Interfaces/Context";
import { RenderPipeline, VertexAttribibute } from "../Interfaces/RenderPipeline";
import { WebGPUShaderModule } from "../WebGPU/WebGPUShaderModule";
import { WebGLBuffer } from "./WebGLBuffer";
import { WebGLCommandBuffer } from "./WebGLCommandBuffer";
import { WebGLRenderPipeline } from "./WebGLRenderPipeline";
import { WebGLShaderModule } from "./WebGLShaderModule";


export class WebGLContext extends Context {
  public static readonly clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
  constructor(canvas: HTMLCanvasElement) {
    super();
    this.cntx = canvas.getContext('webgl2')!;
  }

  override async Init(): Promise<void> {
    (this.cntx as WebGL2RenderingContext).viewport(0, 0, this.cntx.canvas.width, this.cntx.canvas.height);
  }

  Context(): WebGL2RenderingContext {
    return this.cntx as WebGL2RenderingContext;
  }

  override CreateShaderModule(code: string[]): WebGPUShaderModule|WebGLShaderModule {
      const s = new WebGLShaderModule();
      s.Create(this, code[0], code[1]);
      return s;
  }

  override CreateBuffer(bufferType: BufferType, size: number, data?: ArrayBufferLike): Buffer {
    const b = new WebGLBuffer();
    b.Create(this, bufferType, size, data);
    return b;
  }

  override CreateRenderPipeline(vertexLayout: VertexAttribibute[], shaderCode: string[]): RenderPipeline {
    const r = new WebGLRenderPipeline();
    r.Create(this, vertexLayout, shaderCode);
    return r;
  }

  override CreateCommandBuffer(): CommandBuffer {
    const c = new WebGLCommandBuffer();
    c.Create(this);
    return c;
  }
}