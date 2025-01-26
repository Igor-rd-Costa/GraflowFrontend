import { Component, signal } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';

@Component({
  selector: 'Outliner',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Outliner.component.html',
})
export class Outliner {
  protected heading = signal<string>("Outliner");
}
