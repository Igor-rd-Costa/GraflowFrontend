import { Buffer } from "../Interfaces/Buffer";
import { CommandBuffer } from "../Interfaces/CommandBuffer";
import { Context } from "../Interfaces/Context";
import { RenderPass } from "../Interfaces/RenderPass";
import { RenderPipeline } from "../Interfaces/RenderPipeline";
import { WebGLBuffer } from "./WebGLBuffer";
import { WebGLContext } from "./WebGLContext";
import { WebGLRenderPipeline } from "./WebGLRenderPipeline";


export class WebGLRenderPass extends RenderPass {
  gl!: WebGL2RenderingContext;

  override Create(commandBuffer: CommandBuffer, context: Context): void {
    this.gl = (context as WebGLContext).Context();
    this.gl.clearColor(WebGLContext.clearColor.r, WebGLContext.clearColor.g, WebGLContext.clearColor.b, WebGLContext.clearColor.a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  override BindPipeline(pipeline: RenderPipeline): void {
    this.gl.useProgram((pipeline as WebGLRenderPipeline).shader.program);
  }

  override BindVertexBuffer(vertexBuffer: Buffer): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (vertexBuffer as WebGLBuffer).buffer);
  }

  override Draw(vertexCount: number): void {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
  }

  override DrawIndexed(indexCount: number): void {
    this.gl.drawElements(this.gl.TRIANGLES, indexCount, this.gl.UNSIGNED_INT, 0);
  }

  override End(): void {
    
  }
}