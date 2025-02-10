import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'TimelineEntity',
  standalone: true,
  imports: [],
  templateUrl: './TimelineEntity.component.html',
  styles: `
    :host {
      display: contents;
    }

    .selected {
      background-color: var(--color-bright);
      border-color: var(--color-skyBlueBright);
    }
  `
})
export class TimelineEntity {
  @ViewChild('entity') private entity!: ElementRef<HTMLElement>; 
  @Input({required: true}) id!: string;
  @Input({required: true}) left!: number;
  @Input({required: true}) width!: number; 

  Select() {
    this.entity.nativeElement.classList.add('selected');
  }
  
  UnSelect() {
    this.entity.nativeElement.classList.remove('selected');
  }

  Element() {
    return this.entity.nativeElement;
  }
}
