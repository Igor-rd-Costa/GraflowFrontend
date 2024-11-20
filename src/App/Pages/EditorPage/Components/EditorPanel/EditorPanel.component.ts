import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { Size } from '../../EditorPage.component';

@Component({
  selector: 'EditorPanel',
  standalone: true,
  imports: [],
  templateUrl: './EditorPanel.component.html',
  styleUrl: './EditorPanel.component.css'
})
export class EditorPanel {
  @ViewChild('panel') panel!: ElementRef<HTMLElement>;
  @Input() heading = "";
}
