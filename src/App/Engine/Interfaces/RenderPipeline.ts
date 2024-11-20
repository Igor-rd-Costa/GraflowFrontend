import { Context } from "./Context";

export enum VertexFormat {
  FLOAT, FLOAT2, FLOAT3, FLOAT4
};

export type VertexAttribibute = {
  name: string,
  format: VertexFormat
};


export abstract class RenderPipeline {
  
  abstract Create(context: Context, vertexLayout: VertexAttribibute[], shaderCode: string[]): void;

  abstract Pipeline(): GPURenderPipeline|undefined;
}