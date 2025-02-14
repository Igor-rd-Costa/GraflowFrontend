import { Component, effect, ElementRef, Input, model, signal, ViewChild } from '@angular/core';
import { ProjectTimelineEntity } from '../../../../../../Services/ProjectService';
import { TimelineService } from '../../../../../../Services/TimelineService';

enum EntityResizeMode {
  DISABLED, START, END 
}

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
  @ViewChild('entity') private element!: ElementRef<HTMLElement>; 
  entity = model.required<ProjectTimelineEntity>();
  left: number = 0;
  width: number = 0;
  private resizeMode = signal<EntityResizeMode>(EntityResizeMode.DISABLED);

  constructor(private timelineService: TimelineService) {
    effect(() => {
      const entity = this.entity();
      this.left = this.timelineService.SecondsToPixels(entity.start);
      this.width = this.timelineService.SecondsToPixels(entity.end - entity.start);
    });
  }

  Select() {
    this.element.nativeElement.classList.add('selected');
  }
  
  UnSelect() {
    this.element.nativeElement.classList.remove('selected');
  }

  Element() {
    return this.element.nativeElement;
  }
  
  protected OnMouseMove(event: MouseEvent) {
    if (!event.target || this.resizeMode() !== EntityResizeMode.DISABLED) {
      return;
    }
    const t = event.target as HTMLElement;
    const rect = t.getBoundingClientRect();
    const x = rect.x;
    const w = rect.width;
    const offsetX = (event.clientX) - x;
    if (offsetX < 10 || offsetX > (w - 10)) {
      this.element.nativeElement.style.cursor = 'e-resize';
    } else {
      this.element.nativeElement.style.cursor = '';
    }
  }
  
  protected OnMouseDown(event: MouseEvent) {
    if (!event.target) {
      return;
    }
    event.stopPropagation();
    const t = event.target as HTMLElement;
    if (this.resizeMode() === EntityResizeMode.DISABLED) {
      const rect = t.getBoundingClientRect();
      const x = rect.x;
      const w = rect.width;
      const offsetX = (event.clientX) - x;
      let newResizeMode = EntityResizeMode.DISABLED;
      if (offsetX < 10) {
        newResizeMode = EntityResizeMode.START;
      } else if (offsetX > (w - 10)) {
        newResizeMode = EntityResizeMode.END;
      } else {
        this.timelineService.SelectEntity(this);
        return; 
      }
      this.resizeMode.set(newResizeMode);
      const onResizeMouseMove = (event: MouseEvent) => {
        const resizeMode = this.resizeMode();
        if (resizeMode === EntityResizeMode.DISABLED) {
          return;
        }
        const entity = this.element .nativeElement;
        const rect = entity.getBoundingClientRect();
        const l = parseInt(entity.style.left);
        const w = parseInt(entity.style.width);
        if (resizeMode === EntityResizeMode.START) {
          const offsetX = event.clientX - rect.x;
          if ((l + offsetX) < (l + w - 20)) {
            entity.style.left = l + offsetX + 'px'
            entity.style.width = w - offsetX + 'px';
          }
          return;
        }
        const offsetX = (event.clientX) - (rect.x + rect.width);
        entity.style.width = Math.max((w + offsetX), 20) + 'px';
      };
      const onResizeMouseUp = () => {
        this.resizeMode.set(EntityResizeMode.DISABLED);
        document.removeEventListener('mousemove', onResizeMouseMove);
        document.removeEventListener('mouseup', onResizeMouseUp);
      }
      document.addEventListener('mousemove', onResizeMouseMove);
      document.addEventListener('mouseup', onResizeMouseUp);
    }
  }
}
