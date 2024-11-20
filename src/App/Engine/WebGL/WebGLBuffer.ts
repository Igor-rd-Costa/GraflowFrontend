import { Buffer, BufferType } from "../Interfaces/Buffer";
import { Context } from "../Interfaces/Context";
import { WebGLContext } from "./WebGLContext";


export class WebGLBuffer extends Buffer {
  buffer!: globalThis.WebGLBuffer;

  public constructor() {
    super();
  }

  override Create(context: Context, type: BufferType, size: number, data?: ArrayBufferLike): void {
    const gl = (context as WebGLContext).Context();
    const b = gl.createBuffer();
    let target = 0;
    switch(type) {
      case BufferType.VERTEX_BUFFER:
        target = gl.ARRAY_BUFFER;
        break;
      case BufferType.INDEX_BUFFER:
        target = gl.ELEMENT_ARRAY_BUFFER;
        break;
      case BufferType.UNIFORM_BUFFER:
        target = gl.UNIFORM_BUFFER;
        break;
      default:
        throw new Error(`WebGLBuffer: Create() -> Invalid BufferType ${type}`);
    }
    if (b === null) {
      throw new Error(`WebGLBuffer: Create() -> Failed to create buffer of type ${type}`);
    }
    this.buffer = b;
    if (data) {
      gl.bindBuffer(target, this.buffer);
      gl.bufferData(target, data, gl.STATIC_DRAW)
    }
  }

  override Destroy(): void {
    
  }
  
}