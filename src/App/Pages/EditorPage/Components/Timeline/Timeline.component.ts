import { Component } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';

@Component({
  selector: 'Timeline',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Timeline.component.html',
  styleUrl: './Timeline.component.css'
})
export class Timeline {
}
