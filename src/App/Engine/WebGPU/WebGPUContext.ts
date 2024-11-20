/// <reference types="@webgpu/types" />
import { Buffer, BufferType } from "../Interfaces/Buffer";
import { CommandBuffer } from "../Interfaces/CommandBuffer";
import { Context } from "../Interfaces/Context";
import { RenderPipeline, VertexAttribibute } from "../Interfaces/RenderPipeline";
import { ShaderModule } from "../Interfaces/ShaderModule";
import { WebGPUBuffer } from "./WebGPUBuffer";
import { WebGPUCommandBuffer } from "./WebGPUCommandBuffer";
import { WebGPURenderPipeline } from "./WebGPURenderPipeline";
import { WebGPUShaderModule } from "./WebGPUShaderModule";

export class WebGPUContext extends Context {
  public static readonly clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
  private adapter!: GPUAdapter;
  private device!: GPUDevice;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.cntx = canvas.getContext('webgpu')!;
  }

  override async Init(): Promise<void> {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance'
    });
    if (adapter === null) {
      throw Error("Failed to initialize webgpu");
    }
    this.adapter = adapter;
    this.device = await adapter.requestDevice();
    (this.cntx as GPUCanvasContext).configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied'
    });
  }

  Context(): GPUCanvasContext {
    return this.cntx as GPUCanvasContext;
  }

  Device(): GPUDevice {
    return this.device;
  }

  override CreateShaderModule(code: string[]) {
    const s = new WebGPUShaderModule();
    s.Create(this, code[0], "");
    return s;
  }

  override CreateBuffer(bufferType: BufferType, size: number, data?: ArrayBufferLike) {
    const b = new WebGPUBuffer();
    b.Create(this, bufferType, size, data);
    return b;
  }

  override CreateRenderPipeline(vertexLayout: VertexAttribibute[], shaderCode: string[]): RenderPipeline {
    const r = new WebGPURenderPipeline();
    r.Create(this, vertexLayout, shaderCode);
    return r;
  }

  override CreateCommandBuffer(): CommandBuffer {
    const b = new WebGPUCommandBuffer();
    b.Create(this);
    return b;
  }


  CreateOtherThingsTemp(shader: ShaderModule, vertexBuffer: Buffer) {
    const vertexBufferLayout: GPUVertexBufferLayout[] = [
      {
        attributes: [
          {
            shaderLocation: 0, // position
            offset: 0,
            format: "float32x4",
          },
          {
            shaderLocation: 1, // color
            offset: 16,
            format: "float32x4",
          },
        ],
        arrayStride: 32,
        stepMode: "vertex",
      },
    ];

    const pipelineDescriptor: GPURenderPipelineDescriptor = {
      vertex: {
        module: (shader as WebGPUShaderModule).Module() as GPUShaderModule,
        entryPoint: "vertex_main",
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: (shader as WebGPUShaderModule).Module() as GPUShaderModule,
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
    
    const renderPipeline = this.device.createRenderPipeline(pipelineDescriptor);

    const commandEncoder = this.device.createCommandEncoder();

    const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: clearColor,
          loadOp: "clear",
          storeOp: "store",
          view: (this.cntx as GPUCanvasContext).getCurrentTexture().createView(),
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(renderPipeline);
    passEncoder.setVertexBuffer(0, (vertexBuffer as WebGPUBuffer).buffer);
    passEncoder.draw(3);
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}