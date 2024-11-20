import { Context } from "../Interfaces/Context";
import { RenderPipeline, VertexAttribibute, VertexFormat } from "../Interfaces/RenderPipeline";
import { WebGPUContext } from "./WebGPUContext";
import { WebGPUShaderModule } from "./WebGPUShaderModule";

type VertexAttributeInfo = {
  size: number,
  gpuFormat: GPUVertexFormat
}

export class WebGPURenderPipeline extends RenderPipeline {
  shader!: WebGPUShaderModule;
  renderPipeline!: GPURenderPipeline;

  public constructor() {
    super();
  }

  override Create(context: Context, vertexLayout: VertexAttribibute[],  shaderCode: string[]): void {
    this.shader = context.CreateShaderModule(shaderCode) as WebGPUShaderModule;
    if (vertexLayout.length === 0) {
      throw new Error("WebGPURenderPipeline: Create() -> vertexLayout is empty");
    }

    const vertexBufferLayout: GPUVertexBufferLayout[] = [];
    let stride = 0;
    let attributes: GPUVertexAttribute[] = [];
    for (let i = 0; i < vertexLayout.length; i++) {
      const formatInfo = WebGPURenderPipeline.GetVertexAttributeFormatInfo(vertexLayout[i].format);
      attributes.push({
        shaderLocation: i,
        offset: stride,
        format: formatInfo.gpuFormat 
      });
      stride += formatInfo.size;
    }

    vertexBufferLayout.push({
      attributes: attributes,
      arrayStride: stride,
      stepMode: 'vertex'
    });
    
    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      vertex: {
        module: this.shader.Module() as GPUShaderModule,
        entryPoint: "vertex_main",
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: this.shader.Module() as GPUShaderModule,
        entryPoint: "fragment_main",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
      layout: "auto",
    };
    const device = (context as WebGPUContext).Device();
    this.renderPipeline = device.createRenderPipeline(pipelineDescriptor);
  }

  override Pipeline(): GPURenderPipeline {
    return this.renderPipeline;
  }

  private static GetVertexAttributeFormatInfo(format: VertexFormat): VertexAttributeInfo {
    switch(format) {
      case VertexFormat.FLOAT: return {size: 4, gpuFormat: "float32"};
      case VertexFormat.FLOAT2: return {size: 8, gpuFormat: "float32x2"};
      case VertexFormat.FLOAT3: return {size: 12, gpuFormat: "float32x3"};
      case VertexFormat.FLOAT4: return {size: 16, gpuFormat: "float32x4"};
    }
  }
}