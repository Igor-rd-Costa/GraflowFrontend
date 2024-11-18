import { Component, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { GlobalEventsService } from '../../../../Services/GlobalEventsService';

@Component({
  selector: 'HorizontalResizeBar',
  standalone: true,
  imports: [],
  templateUrl: './HorizontalResizeBar.component.html',
  styleUrl: './HorizontalResizeBar.component.css'
})
export class HorizontalResizeBar {
  @ViewChild('bar') bar! : ElementRef<HTMLElement>;
  @Output() resize = new EventEmitter<number>();

  constructor(private eventSystem: GlobalEventsService) {}

  ngAfterViewInit(): void {
    this.eventSystem.OnPointerDown(this.OnPointerDown.bind(this));
    this.eventSystem.OnPointerUp(this.OnPointerUp.bind(this));
    this.eventSystem.OnPointerMove(this.OnPointerMove.bind(this));
  }

  private lastPoint = signal<number|null>(null);
  OnPointerDown(event: PointerEvent) {
    const resizeBar = (event.target as HTMLElement).closest('.resize-bar'); 
    if (resizeBar === null || resizeBar !== this.bar.nativeElement) {
      return;
    }
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize'
    this.lastPoint.set(event.pageY);
  }

  OnPointerUp(event: PointerEvent) {
    if (this.lastPoint() === null) {
      return;
    }
    document.body.style.userSelect = '';
    document.body.style.cursor = ''
    this.lastPoint.set(null);
  }

  OnPointerMove(event: PointerEvent) {
    if (this.lastPoint() === null) {
      return;
    }
    const x = event.pageY - this.lastPoint()!;
    this.lastPoint.set(event.pageY);
    this.resize.emit(x);
  }
}
