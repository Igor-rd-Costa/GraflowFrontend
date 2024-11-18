import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditorPanel, ResizeFlag } from '../EditorPanel/EditorPanel.component';
import { Size } from '../../EditorPage.component';

@Component({
  selector: 'Properties',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Properties.component.html',
  styleUrl: './Properties.component.css'
})
export class Properties {
  @Input() resizeFlag: ResizeFlag = 0;
  @Input() size: Size = {w: 0, h: 0 };
}
