import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorPanel, ResizeFlag } from '../EditorPanel/EditorPanel.component';
import { Size } from '../../EditorPage.component';

@Component({
  selector: 'View',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './View.component.html',
  styleUrl: './View.component.css'
})
export class View {
  @Input() resizeFlag: ResizeFlag = 0;
  @Input() size: Size = { w: 0, h: 0 };
}
