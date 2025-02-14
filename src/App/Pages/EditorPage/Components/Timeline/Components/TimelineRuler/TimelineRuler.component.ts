import { AfterViewInit, Component, computed, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { TimelineService } from '../../../../../../Services/TimelineService';
import { TimelinePointer } from '../TimelinePointer/TimelinePointer.component';

@Component({
  selector: 'TimelineRuler',
  standalone: true,
  imports: [TimelinePointer],
  templateUrl: './TimelineRuler.component.html',
})
export class TimelineRuler implements AfterViewInit {
  @ViewChild('ruler') private ruler!: ElementRef<HTMLElement>;
  @ViewChild(TimelinePointer) private pointer!: TimelinePointer;
  protected timeSections = computed<string[]>(() => {
    const duration = this.timelineService.Duration();
    const timelineSectionLength = 30;
    return Array.from({length: Math.ceil(duration / timelineSectionLength)}, (v, k) => {
      const val = timelineSectionLength * (k + 1);
      const min = Math.floor(val/60);
      const sec = val%60;
      return `${min < 10 ? '0': ''}${min}:${sec < 10 ? '0' : ''}${sec}`
    });
  });

  constructor(private timelineService: TimelineService) {
    effect(() => {
      const ruler = this.ruler.nativeElement;
      const rect = ruler.getBoundingClientRect();
    })
  }

  ngAfterViewInit() {
    const ruler = this.ruler.nativeElement;
    const rect = ruler.getBoundingClientRect();
    this.timelineService.SetRulerX(rect.x);
    this.timelineService.SetPixelsPerSecondRatio(rect.width / this.timelineService.Duration());
  }

  protected OnMouseDown(event: MouseEvent) {
    if (event.target && this.pointer.Element().contains(event.target as HTMLElement)) {
      return;
    }
    const rulerX = this.ruler.nativeElement.getBoundingClientRect().x;
    const offset = event.clientX - rulerX;
    this.timelineService.SetRulerX(rulerX);
    this.timelineService.SetCurrentTime(this.timelineService.PixelsToSeconds(offset));
    this.pointer.OnRullerClick();
    event.stopPropagation();
  }

  Element() {
    return this.ruler.nativeElement;
  }

  OnTimelineScroll() {
    this.timelineService.SetRulerX(this.ruler.nativeElement.getBoundingClientRect().x);
  }

  Pointer() {
    return this.pointer;
  }
}
