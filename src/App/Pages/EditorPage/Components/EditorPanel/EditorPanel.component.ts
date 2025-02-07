import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'EditorPanel',
  standalone: true,
  imports: [],
  templateUrl: './EditorPanel.component.html',
})
export class EditorPanel {
  @ViewChild('panel') private panel!: ElementRef<HTMLElement>;
  @Input() heading = "";

  Element() {
    return this.panel.nativeElement;
  }
}
