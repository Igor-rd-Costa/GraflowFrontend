import { Context } from "./Context";

export enum BufferType {
  INVALID_BUFFER, VERTEX_BUFFER, INDEX_BUFFER, UNIFORM_BUFFER
}

export abstract class Buffer {
  protected type: BufferType;

  constructor() {
    this.type = BufferType.INVALID_BUFFER;
  }

  abstract Create(context: Context, type: BufferType, size: number, data?: ArrayBufferLike): void;
  abstract Destroy(): void;
}