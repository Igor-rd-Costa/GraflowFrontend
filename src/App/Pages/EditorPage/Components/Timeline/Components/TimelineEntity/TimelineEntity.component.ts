import { Component, Input } from '@angular/core';

@Component({
  selector: 'TimelineEntity',
  standalone: true,
  imports: [],
  templateUrl: './TimelineEntity.component.html',
  styles: `
    :host {
      display: contents;
    }
  `
})
export class TimelineEntity {
  @Input({required: true}) id!: string;
  @Input({required: true}) left!: number;
  @Input({required: true}) width!: number; 
}
