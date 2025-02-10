import { AfterViewInit, Component, computed, effect, ElementRef, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';
import { ProjectService, ProjectTimeline } from '../../../../Services/ProjectService';
import { TimelineEntity } from "./Components/TimelineEntity/TimelineEntity.component";

@Component({
  selector: 'Timeline',
  standalone: true,
  imports: [EditorPanel, TimelineEntity],
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
  @ViewChild('dropCreatePreview') private dropCreatePreview!: ElementRef<HTMLElement>;
  @ViewChild('layersWrapper') private layersWrapper!: ElementRef<HTMLElement>;
  @ViewChildren('layer') private layers!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren(TimelineEntity) private timelineEntities!: QueryList<TimelineEntity>;
  @ViewChild(EditorPanel) private panel!: EditorPanel;
  selectedEntity: string|null = null;
  timeline = signal<ProjectTimeline|null>(null);
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

  constructor(private projectService: ProjectService) {
    effect(() => {
      const timeline = this.projectService.Timeline();
      this.timeline.set(timeline);
    }, {allowSignalWrites: true})
  }

  ngAfterViewInit(): void {
    this.timelineHeight.set((this.panel.Element().getBoundingClientRect().height - 32) + 'px');
    document.addEventListener('click', (event: MouseEvent) => {
      if (this.selectedEntity) {
        const entity = this.GetTimelineEntity(this.selectedEntity)
        if (!entity || entity.Element().contains(event.target as HTMLElement)) {
          return;
        }
        entity.UnSelect();
        this.selectedEntity = null;
      }
    });
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

  OnLayerDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.target === null) {
      return;
    }
    const t = event.target as HTMLElement;
    const wrapper = this.layersWrapper.nativeElement;
    const preview = this.dropCreatePreview.nativeElement;
    if (!wrapper || !preview) {
      return;
    }
    const y = ((t.getBoundingClientRect().top) - (wrapper.getBoundingClientRect().top)) + wrapper.scrollTop;
    let x = (event.clientX) - (wrapper.getBoundingClientRect().x);
    if ((x + preview.getBoundingClientRect().width) > t.getBoundingClientRect().width) {
      x = t.getBoundingClientRect().width - preview.getBoundingClientRect().width;
    }
    this.ShowDropPreview(x, y);
  }

  OnPreviewDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.target === null) {
      return;
    }
    const t = event.target as HTMLElement;
    const wrapper = this.layersWrapper.nativeElement;
    const preview = this.dropCreatePreview.nativeElement;
    if (!wrapper || !preview) {
      return;
    }
    const topOffset = ((event.clientY) - wrapper.getBoundingClientRect().top) + wrapper.scrollTop;
    const layerHeight = 4.5 * 16;
    const layerIndex = Math.floor(topOffset / layerHeight);
    const layer = this.layers.get(layerIndex)?.nativeElement;
    if (layer === undefined) {
      return;
    }
    const previewWidth = preview.getBoundingClientRect().width;
    const y = ((layer.getBoundingClientRect().top + wrapper.scrollTop) - (wrapper.getBoundingClientRect().top));
    let x = (event.clientX) - (layer.getBoundingClientRect().x);
    if ((x + previewWidth) > layer.getBoundingClientRect().width) {
      x = layer.getBoundingClientRect().width - previewWidth;
    }
    this.ShowDropPreview(x, y);
  }

  OnDrop(event: DragEvent, layerIndex: number) {
    if (!event.target) {
      this.HideDropPreview();
      return;
    }
    const t = event.target as HTMLElement;
    const wrapper = this.layersWrapper.nativeElement;
    if (!wrapper) {
      return;
    }
    const x = (event.clientX) - (wrapper.getBoundingClientRect().left);
    const start = this.TimeAt(x);
    this.projectService.AddTimelineEntity(start, start + 30, layerIndex);
    this.HideDropPreview();
  }

  OnPreviewDrop(event: DragEvent) {
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
    const start = this.TimeAt(x);
    this.projectService.AddTimelineEntity(start, start + 30, layerIndex);
    this.HideDropPreview();
  }

  protected SelectEntity(entityId: string) {
    if (entityId === this.selectedEntity) {
      return;
    }
    const entity = this.GetTimelineEntity(entityId);
    if (!entity) {
      return;
    }
    if (this.selectedEntity) {
      this.GetTimelineEntity(this.selectedEntity)?.UnSelect();
    }
    this.selectedEntity = entityId;
    entity.Select();
  }

  private GetTimelineEntity(entityId: string) {
    for (let i = 0; i < this.timelineEntities.length; i++) {
      if (this.timelineEntities.get(i)!.id === entityId) {
        return this.timelineEntities.get(i)!;
      }
    }
    return null;
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

  private TimeAt(x: number) {
    const ruler = this.timelineRuler.nativeElement;
    const timeline = this.timeline();
    if (!ruler || !timeline) {
      return 0;
    }
    const w = ruler.getBoundingClientRect().width;
    const timelineLength = timeline.duration < 300 ? 300 : timeline.duration;
    const delta = timelineLength / w;
    return Math.floor(delta * x);
  }

  protected TimeToPixels(time: number) {
    const ruler = this.timelineRuler.nativeElement;
    const timeline = this.timeline();
    if (!ruler || !timeline) {
      return 0;
    }
    const w = ruler.getBoundingClientRect().width;
    const timelineLength = timeline.duration < 300 ? 300 : timeline.duration;
    const delta = w / timelineLength;
    return Math.floor(delta * time);
  }
}
