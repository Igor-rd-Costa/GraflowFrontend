import { Context } from "../Interfaces/Context";
import { RenderPipeline, VertexAttribibute, VertexFormat } from "../Interfaces/RenderPipeline";
import { WebGLContext } from "./WebGLContext";
import { WebGLShaderModule } from "./WebGLShaderModule";

type VertexAttributeInfo = {
  size: number,
  glSize: number,
  gpuFormat: string
}

export class WebGLRenderPipeline extends RenderPipeline {
  shader!: WebGLShaderModule;

  override Create(context: Context, vertexLayout: VertexAttribibute[], shaderCode: string[]): void {
    this.shader = context.CreateShaderModule(shaderCode) as WebGLShaderModule;
    if (vertexLayout.length === 0) {
      throw new Error("WebGLRenderPipeline: Create() -> vertexLayout is empty");
    }
    const gl = (context as WebGLContext).Context();
    this.shader.Bind(context);
    let stride = 0;
    for (let i = 0; i < vertexLayout.length; i++) {
      const info = WebGLRenderPipeline.GetVertexAttributeFormatInfo(gl, vertexLayout[i].format);
      stride += info.size;
    }
    let offset = 0;
    for (let i = 0; i < vertexLayout.length; i++) {
      const info = WebGLRenderPipeline.GetVertexAttributeFormatInfo(gl, vertexLayout[i].format);
      const attribLocation = gl.getAttribLocation(this.shader.program, vertexLayout[i].name)
      gl.enableVertexAttribArray(attribLocation);
      gl.vertexAttribPointer(attribLocation, info.glSize, gl.FLOAT, false, stride, offset);
      offset += info.size;
    }
    this.shader.Unbind(context);
  }

  override Pipeline(): GPURenderPipeline|undefined {
    return undefined;
  }

  private static GetVertexAttributeFormatInfo(gl: WebGL2RenderingContext, format: VertexFormat): VertexAttributeInfo {
    switch(format) {
      case VertexFormat.FLOAT: return {size: 4, glSize: 1, gpuFormat: "float32"};
      case VertexFormat.FLOAT2: return {size: 8, glSize: 2, gpuFormat: "float32x2"};
      case VertexFormat.FLOAT3: return {size: 12, glSize: 3, gpuFormat: "float32x3"};
      case VertexFormat.FLOAT4: return {size: 16, glSize: 4, gpuFormat: "float32x4"};
    }
  }
}