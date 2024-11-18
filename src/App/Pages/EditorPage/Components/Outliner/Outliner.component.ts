import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { EditorPanel, ResizeFlag } from '../EditorPanel/EditorPanel.component';
import { Size } from '../../EditorPage.component';

@Component({
  selector: 'Outliner',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Outliner.component.html',
  styleUrl: './Outliner.component.css'
})
export class Outliner {
  @Input() resizeFlag: ResizeFlag = 0;
  @Input() size: Size = {w: 0, h: 0 };
  protected heading = signal<string>("Outliner");
}
