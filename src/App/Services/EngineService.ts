import { Injectable } from "@angular/core";
import { App } from "../App.component";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class EngineService {
  private address = App.BackendAddress()+"engine/";

  public constructor(private http: HttpClient) {}

  GetShaders() {
    if (navigator.gpu) {
      return [`struct VertexOut {
        @builtin(position) position : vec4f,
        @location(0) color : vec4f
      }
      @vertex
      fn vertex_main(@location(0) position: vec4f,
                      @location(1) color: vec4f) -> VertexOut
      {
        var output : VertexOut;
        output.position = position;
        output.color = color;
        return output;
      }
      @fragment
      fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
      {
        return fragData.color;
      }`];
    }
    return [
      `#version 300 es
      precision highp float;

      in vec4 vPosition;
      in vec4 vColor;

      out vec4 fColor; 

      void main() {
          gl_Position = vPosition;
          fColor = vColor;
      }`,
      `#version 300 es
      precision highp float;

      in vec4 fColor;
      out vec4 fragColor;

      void main() {
          fragColor = fColor;
      }`
    ]
  }
}