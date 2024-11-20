import { Context } from "../Interfaces/Context";
import { ShaderModule } from "../Interfaces/ShaderModule";
import { WebGPUContext } from "./WebGPUContext";


export class WebGPUShaderModule extends ShaderModule {
  module!: GPUShaderModule;
  
  override Create(context: Context, vertexCode: string, fragmentCode: string): void {
    this.module = (context as WebGPUContext).Device().createShaderModule({
      code: vertexCode + fragmentCode
    });
  }

  Module() {
    return this.module;
  }
}