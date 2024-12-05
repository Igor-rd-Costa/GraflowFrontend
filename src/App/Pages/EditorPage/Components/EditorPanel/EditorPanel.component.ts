import { Component, ElementRef, Input, ViewChild } from '@angular/core';

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
