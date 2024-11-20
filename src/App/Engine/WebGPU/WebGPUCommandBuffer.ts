import { CommandBuffer } from "../Interfaces/CommandBuffer";
import { Context } from "../Interfaces/Context";
import { RenderPass } from "../Interfaces/RenderPass";
import { WebGPUContext } from "./WebGPUContext";
import { WebGPURenderPass } from "./WebGPURenderPass";


export class WebGPUCommandBuffer extends CommandBuffer {
  commandEncoder!: GPUCommandEncoder;

  public constructor() {
    super();
  }

  override Create(context: Context): void {
    const device = (context as WebGPUContext).Device();
    this.commandEncoder = device.createCommandEncoder();
  }

  override StartRenderPass(context: Context): RenderPass {
    const renderPass = new WebGPURenderPass();  
    renderPass.Create(this, context);
    return renderPass;
  }

  override Submit(context: Context): void {
    (context as WebGPUContext).Device().queue.submit([this.commandEncoder.finish()]);
  }

  Encoder() {
    return this.commandEncoder;
  }
}