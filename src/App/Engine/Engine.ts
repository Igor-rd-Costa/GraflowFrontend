import { Injector, signal } from "@angular/core";
import Time from "./Time";
import { EngineService } from "../Services/EngineService";
import { Context } from "./Interfaces/Context";
import { WebGLContext } from "./WebGL/WebGLContext";
import { WebGPUContext } from "./WebGPU/WebGPUContext";
import { ShaderModule } from "./Interfaces/ShaderModule";
import { Buffer, BufferType } from "./Interfaces/Buffer";
import { RenderPipeline, VertexFormat } from "./Interfaces/RenderPipeline";
import { CommandBuffer } from "./Interfaces/CommandBuffer";

// temp;
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,
   1.0, -1.0, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,
   0.0,  1.0, 0.0, 1.0,   0.0, 0.0, 1.0, 1.0,
]);


export default class Engine {
  private readonly canvas: HTMLCanvasElement;
  private ctx!: Context;
  private engineService!: EngineService;
  private isMinimized = signal(false);
  private isRunning = signal(true);
  private vertexBuffer!: Buffer;
  private renderPipeline!: RenderPipeline;
  
  public constructor(injector: Injector, canvas: HTMLCanvasElement) {
    if (!Engine.SystemSupportsGraphics(canvas)) {
      throw Error("System does not support any graphics API supported by the application");
    }
    this.engineService = injector.get(EngineService);
    this.canvas = canvas;
  }

  async Init(): Promise<void> {
    const cntxPromise = Engine.CreateContext(this.canvas);
    this.ctx = await cntxPromise;
    this.vertexBuffer = this.ctx.CreateBuffer(BufferType.VERTEX_BUFFER, vertices.byteLength, vertices);
    this.renderPipeline = this.ctx.CreateRenderPipeline([
      { name: "vPosition", format: VertexFormat.FLOAT4}, 
      { name: "vColor", format: VertexFormat.FLOAT4}
    ], this.engineService.GetShaders());
  }

  Run() {
    const runFn = () => {
      if (!this.isRunning())
        return;
 
      Time.Update();
 
      if (!this.isMinimized()) {
        const commandBuffer = this.ctx.CreateCommandBuffer();
        const renderPass = commandBuffer.StartRenderPass(this.ctx);
        renderPass.BindPipeline(this.renderPipeline);
        renderPass.BindVertexBuffer(this.vertexBuffer);
        renderPass.Draw(3);
        renderPass.End();
        commandBuffer.Submit(this.ctx);
      }
      requestAnimationFrame(runFn);
    };
    requestAnimationFrame(runFn);
  }

  Context() {
    return this.ctx;
  }

  static InvalidEnumError(enumName: string) {
    throw new Error(`Invalid ${enumName} value provided`);
  }

  private static async CreateContext(canvas: HTMLCanvasElement): Promise<WebGLContext|WebGPUContext> {
    let cntx: WebGPUContext|WebGLContext;
    if (canvas.getContext('webgpu') !== null) {
      cntx = new WebGPUContext(canvas);
    } else if (canvas.getContext('webgl2') !== null) {
      cntx = new WebGLContext(canvas);
    } else {
      throw new Error("System does not support any graphics API supported by the application");
    }

    await cntx.Init();
    return cntx;
  }

  private static SystemSupportsGraphics(canvas: HTMLCanvasElement): boolean {
    return canvas.getContext('webgpu') !== null || canvas.getContext('webgl2') !== null;
  }
} 