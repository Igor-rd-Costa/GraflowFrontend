import { Component, ElementRef, model, ViewChild } from '@angular/core';
import { ProjectTimelineLayer } from '../../../../../../Services/ProjectService';
import { TimelineEntity } from '../TimelineEntity/TimelineEntity.component';

@Component({
  selector: 'TimelineLayer',
  standalone: true,
  imports: [TimelineEntity],
  templateUrl: './TimelineLayer.component.html',
})
export class TimelineLayer {
  @ViewChild("wrapper") private wrapper!: ElementRef<HTMLElement>;
  layer = model.required<ProjectTimelineLayer|null>();

  Element() {
    return this.wrapper.nativeElement;
  }
}
