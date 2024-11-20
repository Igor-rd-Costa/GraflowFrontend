import { Context } from "./Context";
import { RenderPass } from "./RenderPass";


export abstract class CommandBuffer {

  abstract Create(context: Context): void;

  abstract StartRenderPass(context: Context): RenderPass;
  abstract Submit(context: Context): void;
}