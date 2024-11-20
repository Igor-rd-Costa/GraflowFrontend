import { Component } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';

@Component({
  selector: 'Properties',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Properties.component.html',
  styleUrl: './Properties.component.css'
})
export class Properties {
}
