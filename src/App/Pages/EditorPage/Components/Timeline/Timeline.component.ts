import { AfterViewInit, Component, computed, ElementRef, model, signal, ViewChild } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';
import { ProjectTimeline } from '../../../../Services/ProjectService';

@Component({
  selector: 'Timeline',
  standalone: true,
  imports: [EditorPanel],
  templateUrl: './Timeline.component.html',
  styles: `
    #timeline-pointer {
      svg {
        fill: var(--color-skyBlue);
      }

      div {
        background-color: var(--color-skyBlue);
      }
    }
    #timeline-pointer.pointer-hovered {
      svg {
        fill: var(--color-skyBlueBright);
      }

      div {
        background-color: var(--color-skyBlueBright);
      }
    }
  `
})
export class Timeline implements AfterViewInit {
  @ViewChild('timelineRuler') private timelineRuler!: ElementRef<HTMLElement>;
  @ViewChild('timelinePointer') private timelinePointer!: ElementRef<HTMLElement>;
  @ViewChild(EditorPanel) private panel!: EditorPanel;
  timeline = model<ProjectTimeline>();
  zoomLevel = signal<number>(1);
  isPlaying = signal<boolean>(false);
  timelinePointerPos = signal<number>(0);
  timelineHeight = signal<string>("0px");
  timeSections = computed<string[]>(() => {
    const zoom = this.zoomLevel();
    const timeline = this.timeline();
    if (!timeline) {
      return [];
    }
    const timelineSectionLength = 30;
    const timelineLength = timeline.duration < 300 ? 300 : timeline.duration;
    return Array.from({length: Math.ceil(timelineLength / timelineSectionLength)}, (v, k) => {
      const val = timelineSectionLength * (k + 1);
      const min = Math.floor(val/60);
      const sec = val%60;
      return `${min < 10 ? '0': ''}${min}:${sec < 10 ? '0' : ''}${sec}`
    });
  });
  currentTime = computed<string>(() => {
    const pos = this.timelinePointerPos();
    const l = this.timeSections().length;
    if (!this.timelineRuler) {
      return "00:00";
    }
    const w = this.timelineRuler.nativeElement.getBoundingClientRect().width;
    const timeSec = (pos / (w / l)) * 30;
    const min = Math.floor(timeSec / 60);
    const sec = Math.floor(timeSec % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;  
  })

  ngAfterViewInit(): void {
    this.timelineHeight.set((this.panel.Element().getBoundingClientRect().height - 32) + 'px');
  }

  Play() {
    this.isPlaying.set(true);
    //TODO implement this
  }

  Pause() {
    this.isPlaying.set(false);
    //TODO implement this
  }
  
  OnTimelineRulerMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    const x = event.screenX - (this.timelineRuler.nativeElement.getBoundingClientRect().x);
    this.timelinePointerPos.set(x);

    let lastPos = x;
    const onMouseMove = ((event: MouseEvent) => {
      const x = event.screenX - (this.timelineRuler.nativeElement.getBoundingClientRect().x);
      const offset = x - lastPos;
      lastPos = x;
      this.timelinePointerPos.set(Math.min(Math.max(this.timelinePointerPos() + offset, 0), this.timelineRuler.nativeElement.getBoundingClientRect().width));
    }).bind(this);
    
    const onMouseUp = (() => {
      document.removeEventListener('mousemove', onMouseMove);  
      document.removeEventListener('mousemove', onMouseUp);  
    }).bind(this);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  OnPointerMouseEnter() {
    this.timelinePointer.nativeElement.classList.add('pointer-hovered');
  }

  OnPointerMouseLeave() {
    this.timelinePointer.nativeElement.classList.remove('pointer-hovered');
  }

  GetCurrentTime() {
    if (this.timelineRuler) {
      const w = this.timelineRuler.nativeElement.getBoundingClientRect().width;
      const delta = w / this.timeSections().length;
      console.log(delta)
      return "00:00";
    }
      return "00:00";
  }
}
