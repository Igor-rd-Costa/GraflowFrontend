import { AfterViewInit, Component, computed, effect, ElementRef, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';
import { ProjectService, ProjectTimeline } from '../../../../Services/ProjectService';
import { TimelineLayer } from "./Components/TimelineLayer/TimelineLayer.component";
import { TimelineService } from '../../../../Services/TimelineService';
import { TimelineRuler } from './Components/TimelineRuler/TimelineRuler.component';

@Component({
  selector: 'Timeline',
  standalone: true,
  imports: [EditorPanel, TimelineLayer, TimelineRuler],
  templateUrl: './Timeline.component.html',
})
export class Timeline implements AfterViewInit {
  @ViewChild(TimelineRuler) ruler!: TimelineRuler;
  @ViewChildren(TimelineLayer) layers!: QueryList<TimelineLayer>;
  @ViewChild('dropCreatePreview') private dropCreatePreview!: ElementRef<HTMLElement>;
  @ViewChild('layersWrapper') private layersWrapper!: ElementRef<HTMLElement>;
  @ViewChild(EditorPanel) private panel!: EditorPanel;
  timeline: ProjectTimeline|null = null;
  isPlaying = signal<boolean>(false);
  timelineHeight = signal<string>("0px");
  timeSections = computed<string[]>(() => {
    const duration = this.timelineService.Duration();
    const timelineSectionLength = 30;
    return Array.from({length: Math.ceil(duration / timelineSectionLength)}, (_, k) => {
      const val = timelineSectionLength * (k + 1);
      const min = Math.floor(val/60);
      const sec = val%60;
      return `${min < 10 ? '0': ''}${min}:${sec < 10 ? '0' : ''}${sec}`
    });
  });
  currentTime = computed<string>(() => {
    const timeSec = this.timelineService.CurrentTime();
    const min = Math.floor(timeSec / 60);
    const sec = Math.floor(timeSec % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;  
  })

  constructor(private projectService: ProjectService, private timelineService: TimelineService) {
    effect(() => {
      const timeline = this.projectService.Timeline();
      this.timeline = timeline;
      this.timelineService.SetDuration(Math.max(300, timeline?.duration ?? 0));
    }, {allowSignalWrites: true});
  }

  ngAfterViewInit(): void {
    this.timelineHeight.set((this.panel.Element().getBoundingClientRect().height - 32) + 'px');
    document.addEventListener('mousedown', () => {
      this.timelineService.UnSelectEntity();
    });
  }

  OnScroll(event: Event) {
    if (!event.target) {
      return;
    }
    
  }

  Play() {
    this.isPlaying.set(true);
    //TODO implement this
  }

  Pause() {
    this.isPlaying.set(false);
    //TODO implement this
  }

  private enteredDragArea = false;
  protected OnDragEnter() {
    if (this.enteredDragArea) {
      return;
    }
    this.enteredDragArea = true;
    document.addEventListener('dragover', this.OnDragOver);
    document.addEventListener('drop', this.OnDrop);
  }
  
  private OnDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const wrapper = this.layersWrapper.nativeElement;
    const preview = this.dropCreatePreview.nativeElement;
    if (!wrapper || !preview) {
      return;
    }
    const topOffset = ((event.clientY) - wrapper.getBoundingClientRect().top) + wrapper.scrollTop;
    const layerHeight = 4.5 * 16;
    const layerIndex = Math.floor(topOffset / layerHeight);
    const layer = this.layers.get(layerIndex)?.Element();
    if (layer === undefined) {
      return;
    }
    const previewWidth = preview.getBoundingClientRect().width;
    const y = ((layer.getBoundingClientRect().top + wrapper.scrollTop) - (wrapper.getBoundingClientRect().top));
    let x = Math.max((event.clientX) - (layer.getBoundingClientRect().x), 0);
    if ((x + previewWidth) > layer.getBoundingClientRect().width) {
      x = layer.getBoundingClientRect().width - previewWidth;
    }
    this.ShowDropPreview(x, y);
  }

  private OnDrop = (event: DragEvent) => {
    event.stopPropagation();
    this.enteredDragArea = false;
    document.removeEventListener('dragover', this.OnDragOver);
    document.removeEventListener('drop', this.OnDrop);
    if (!event.target) {
      this.HideDropPreview();
      return;
    }
    const t = event.target as HTMLElement;
    const wrapper = this.layersWrapper.nativeElement;
    if (!wrapper) {
      return;
    }
    
    const topOffset = ((event.clientY) - wrapper.getBoundingClientRect().top) + wrapper.scrollTop;
    const layerHeight = 4.5 * 16;
    const layerIndex = Math.floor(topOffset / layerHeight);
    const y = (t.getBoundingClientRect().top) - (wrapper.getBoundingClientRect().top);
    const x = (event.clientX) - (wrapper.getBoundingClientRect().left);
    const start = this.timelineService.PixelsToSeconds(x);
    this.projectService.AddTimelineEntity(start, start + 30, layerIndex);
    this.HideDropPreview();
  }
  
  private ShowDropPreview(x: number, y: number) {
    const preview = this.dropCreatePreview.nativeElement;
    if (!preview) {
      return;
    }
    preview.style.display = 'block';
    preview.style.top = `${y + 1}px`;
    preview.style.left = `${x}px`;
  }

  private HideDropPreview() {
    const preview = this.dropCreatePreview.nativeElement;
    if (!preview) {
      return;
    }
    preview.style.display = 'none';
    preview.style.top = "";
    preview.style.left = "";
  }
}
