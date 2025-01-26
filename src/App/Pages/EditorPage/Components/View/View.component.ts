import { AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';
import Engine from '../../../../Engine/Engine';

@Component({
  selector: 'View',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './View.component.html',
})
export class View implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private engine!: Engine;

  public constructor(private injector: Injector) {}

  async ngAfterViewInit(): Promise<void> {
    
  }

  async Init() {
    if (this.engine !== undefined) {
      return;
    }
    this.engine = new Engine(this.injector, this.canvas.nativeElement);
    try {
      const canvas = this.canvas.nativeElement;
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      await this.engine.Init();
      this.engine.Run();
    } catch (error) {
      console.log("Engine Exception:\n", (error as Error));
      this.canvas.nativeElement.style.backgroundColor = "#808F";
    }

    window.addEventListener('resize', this.OnCanvasResize.bind(this))
  }

  OnCanvasResize() {
    const canvas = this.canvas.nativeElement;
    this.engine.Context().ResizeViewPort(canvas.clientWidth * window.devicePixelRatio, canvas.clientHeight * window.devicePixelRatio);    
  }
}
