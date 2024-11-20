import { Buffer } from "../Interfaces/Buffer";
import { CommandBuffer } from "../Interfaces/CommandBuffer";
import { Context } from "../Interfaces/Context";
import { RenderPass } from "../Interfaces/RenderPass";
import { RenderPipeline } from "../Interfaces/RenderPipeline";
import { WebGPUBuffer } from "./WebGPUBuffer";
import { WebGPUCommandBuffer } from "./WebGPUCommandBuffer";
import { WebGPUContext } from "./WebGPUContext";


export class WebGPURenderPass extends RenderPass {
  passEncoder!: GPURenderPassEncoder;

  override Create(commandBuffer: CommandBuffer, context: Context): void {
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: WebGPUContext.clearColor,
          loadOp: "clear",
          storeOp: "store",
          view: ((context as WebGPUContext).Context() as GPUCanvasContext).getCurrentTexture().createView(),
        },
      ],
    };

    this.passEncoder = (commandBuffer as WebGPUCommandBuffer).Encoder().beginRenderPass(renderPassDescriptor);
  }

  override BindPipeline(pipeline: RenderPipeline): void {
    this.passEncoder.setPipeline(pipeline.Pipeline()!);
  }

  override BindVertexBuffer(vertexBuffer: Buffer): void {
    this.passEncoder.setVertexBuffer(0, (vertexBuffer as WebGPUBuffer).buffer);
  }

  override Draw(vertexCount: number): void {
    this.passEncoder.draw(vertexCount);
  }

  override DrawIndexed(indexCount: number): void {
    this.passEncoder.drawIndexed(indexCount);
  }

  override End(): void {
    this.passEncoder.end();
  }
}