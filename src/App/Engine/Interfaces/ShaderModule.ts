import { Context } from "./Context";


export abstract class ShaderModule {
  abstract Create(context: Context, vertexCode: string, fragmentCode: string): void;
}