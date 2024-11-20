import { Buffer, BufferType } from "./Buffer";
import { CommandBuffer } from "./CommandBuffer";
import { RenderPipeline, VertexAttribibute } from "./RenderPipeline";
import { ShaderModule } from "./ShaderModule";

export abstract class Context {

  protected cntx!: GPUCanvasContext|WebGL2RenderingContext;

  abstract Init(): Promise<void>;

  abstract CreateShaderModule(code: string[]): ShaderModule;
  abstract CreateBuffer(bufferType: BufferType, size: number, data?: ArrayBufferLike): Buffer;
  abstract CreateRenderPipeline(vertexLayout: VertexAttribibute[], shaderCode: string[]): RenderPipeline;
  abstract CreateCommandBuffer(): CommandBuffer;

  abstract ResizeViewPort(w: number, h: number): void;
}