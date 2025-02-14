import { Component, computed, ElementRef, Input, ViewChild } from '@angular/core';
import { TimelineService } from '../../../../../../Services/TimelineService';

@Component({
  selector: 'TimelinePointer',
  standalone: true,
  imports: [],
  templateUrl: './TimelinePointer.component.html',
  styles: `
    :host {
      display: contents;
    }
    #timeline-pointer {
      svg {
        fill: var(--color-skyBlue);
      }

      div:nth-child(2) {
        background-color: var(--color-skyBlue);
      }
    }
    
    #timeline-pointer.hovered {
      svg {
        fill: var(--color-skyBlueBright);
      }

      div:nth-child(2) {
        background-color: var(--color-skyBlueBright);
      }
    }

    
  `
})
export class TimelinePointer {
  @ViewChild('pointer') private pointer!: ElementRef<HTMLElement>;
  protected pos = computed(() => {
    return this.timelineService.SecondsToPixels(this.timelineService.CurrentTime());
  });

  constructor(private timelineService: TimelineService) {}

  OnMouseEnter() {
    this.pointer.nativeElement.classList.add('hovered');
  }
  
  OnMouseLeave() {
    this.pointer.nativeElement.classList.remove('hovered');
  }

  Element() {
    return this.pointer.nativeElement;
  }
  
  OnMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    const svg = this.pointer.nativeElement.firstElementChild!;
    if (event.target === null || !svg.contains(event.target as HTMLElement)) {
      return;
    }
    this.OnRullerClick();
  }

  OnMouseMove = (event: MouseEvent) => {
    const x = event.clientX;
    const offset = x - this.timelineService.GetRulerX();
    this.timelineService.SetCurrentTime(this.timelineService.PixelsToSeconds(offset));
    event.stopPropagation();
  };

  OnMouseUp = () => {
    document.removeEventListener('mousemove', this.OnMouseMove);
    document.removeEventListener('mouseup', this.OnMouseUp);
  };

  OnRullerClick() {
    document.addEventListener('mousemove', this.OnMouseMove);
    document.addEventListener('mouseup', this.OnMouseUp);
  }
}
