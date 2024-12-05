import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'MainButton',
  standalone: true,
  imports: [],
  templateUrl: './MainButton.component.html',
  styleUrl: './MainButton.component.css'
})
export class MainButton {
  @Output() onClick = new EventEmitter<MouseEvent>();
  @Input() type: 'button'|'submit'|'menu'|'reset' = 'submit';
  @Input() disabled: boolean = false;

  OnClick(event: MouseEvent) {
    this.onClick.emit(event);
  }
}
