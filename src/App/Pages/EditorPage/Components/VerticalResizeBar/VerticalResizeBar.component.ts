import { AfterViewInit, Component, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { App } from '../../../../App.component';
import { GlobalEventsService } from '../../../../Services/GlobalEventsService';


@Component({
  selector: 'VerticalResizeBar',
  standalone: true,
  imports: [],
  templateUrl: './VerticalResizeBar.component.html',
  styleUrl: './VerticalResizeBar.component.css'
})
export class VerticalResizeBar implements AfterViewInit {
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
    document.body.style.cursor = 'col-resize';
    this.lastPoint.set(event.pageX);
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
    const x = event.pageX - this.lastPoint()!;
    this.lastPoint.set(event.pageX);
    this.resize.emit(x);
  }
}
