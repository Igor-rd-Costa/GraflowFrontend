import { Buffer } from "./Buffer";
import { CommandBuffer } from "./CommandBuffer";
import { Context } from "./Context";
import { RenderPipeline } from "./RenderPipeline";


export abstract class RenderPass {

  abstract Create(commandBuffer: CommandBuffer, context: Context): void;

  abstract BindPipeline(pipeline: RenderPipeline): void;
  abstract BindVertexBuffer(vertexBuffer: Buffer): void;
  abstract Draw(vertexCount: number): void;
  
  abstract DrawIndexed(indexCount: number): void;

  abstract End(): void;
}