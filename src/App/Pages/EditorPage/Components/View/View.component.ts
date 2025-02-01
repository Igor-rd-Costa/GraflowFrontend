import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';

@Component({
  selector: 'View',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './View.component.html',
})
export class View implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  public constructor() {}

  async ngAfterViewInit(): Promise<void> {
    
  }

  async Init() {
    let script: string;
    try {
      script = await (await fetch('/GraflowEngine.js')).text();

    } catch(e) {
      console.error("Unable to locate Graflow runtime.");
      return;
    }
    const canvas = this.canvas.nativeElement;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    (0, eval)(script);
  }
}
