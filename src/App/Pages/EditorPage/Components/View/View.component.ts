import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { EditorPanel, ResizeFlag } from '../EditorPanel/EditorPanel.component';
import { Size } from '../../EditorPage.component';
import Engine from '../../../../Engine/Engine';

@Component({
  selector: 'View',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './View.component.html',
  styleUrl: './View.component.css'
})
export class View implements AfterViewInit {
  @Input() resizeFlag: ResizeFlag = 0;
  @Input() size: Size = { w: 0, h: 0 };
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private engine!: Engine;

  public constructor(private injector: Injector) {}

  async ngAfterViewInit(): Promise<void> {
    this.engine = new Engine(this.injector, this.canvas.nativeElement);
    try {
      await this.engine.Init();
      this.engine.Run();
    } catch (error) {
      console.log("Engine Exception:\n", (error as Error));
      this.canvas.nativeElement.style.backgroundColor = "#808F";
    }
  }
}
