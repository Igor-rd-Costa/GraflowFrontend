import { Component, Input } from '@angular/core';
import { EditorPanel, ResizeFlag } from '../EditorPanel/EditorPanel.component';
import { Size } from '../../EditorPage.component';

@Component({
  selector: 'Timeline',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Timeline.component.html',
  styleUrl: './Timeline.component.css'
})
export class Timeline {
  @Input() resizeFlag: ResizeFlag = 0;
  @Input() size: Size = {w: 0, h: 0};
}
