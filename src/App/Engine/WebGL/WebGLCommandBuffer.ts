import { CommandBuffer } from "../Interfaces/CommandBuffer";
import { Context } from "../Interfaces/Context";
import { RenderPass } from "../Interfaces/RenderPass";
import { WebGLContext } from "./WebGLContext";
import { WebGLRenderPass } from "./WebGLRenderPass";


export class WebGLCommandBuffer extends CommandBuffer {
  private gl!: WebGL2RenderingContext;

  override Create(context: Context): void {
    this.gl = (context as WebGLContext).Context();
  }

  override StartRenderPass(context: Context): RenderPass {
    const r = new WebGLRenderPass();
    r.Create(this, context);
    return r;
  }

  override Submit(context: Context): void {
  }
}