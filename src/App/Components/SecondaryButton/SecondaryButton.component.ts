import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'SecondaryButton',
  standalone: true,
  imports: [],
  templateUrl: './SecondaryButton.component.html'
})
export class SecondaryButton {
  @Output() onClick = new EventEmitter<MouseEvent>();
  @Input() type: 'button'|'submit'|'menu'|'reset' = 'submit';
  @Input() disabled: boolean = false;

  OnClick(event: MouseEvent) {
    this.onClick.emit(event);
  }
}
