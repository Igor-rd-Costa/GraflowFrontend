import Engine from "../Engine";
import { Buffer, BufferType } from "../Interfaces/Buffer";
import { Context } from "../Interfaces/Context";
import { WebGPUContext } from "./WebGPUContext";


export class WebGPUBuffer extends Buffer {
  buffer!: GPUBuffer;

  public constructor() {
    super();
  }

  override Create(context: Context, type: BufferType, size: number, data?: ArrayBufferLike): void {
    let bufferUsage = GPUBufferUsage.COPY_DST;
    switch (type) {
      case BufferType.VERTEX_BUFFER:
        bufferUsage |= GPUBufferUsage.VERTEX;
        break;
      case BufferType.INDEX_BUFFER:
        bufferUsage |= GPUBufferUsage.INDEX;
        break;
      case BufferType.UNIFORM_BUFFER:
        bufferUsage |= GPUBufferUsage.UNIFORM;
        break;
      default:
        Engine.InvalidEnumError(typeof BufferType);
    }
    const c = (context as WebGPUContext);
    this.buffer = c.Device().createBuffer({
      usage: bufferUsage,
      size: size
    });
    if (data) {
      if (data.byteLength !== size) {
        throw new Error("Buffer: Create() -> size does not match data size");
      } 
      c.Device().queue.writeBuffer(this.buffer, 0, data, 0);
    }
  }

  override Destroy(): void {
      
  }
}