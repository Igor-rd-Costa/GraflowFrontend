import { Injectable, signal } from '@angular/core';
import { TimelineEntity } from '../Pages/EditorPage/Components/Timeline/Components/TimelineEntity/TimelineEntity.component';


@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private pixelsPerSecondRatio = signal<number>(0);
  private zoomLevel = signal<number>(1);
  private duration = signal<number>(300);
  private currentTime = signal<number>(0);
  private selectedEntity: TimelineEntity|null = null;
  private rulerX = 0;

  constructor() { }

  SetPixelsPerSecondRatio(ratio: number) {
    this.pixelsPerSecondRatio.set(ratio);
  }

  PixelsPerSecondRatio() {
    return this.pixelsPerSecondRatio();
  }

  SetZoomLevel(zoomLevel: number) {
    this.zoomLevel.set(zoomLevel);
  }

  ZoomLevel() {
    return this.zoomLevel();
  }
  
  SetDuration(duration: number) {
    this.duration.set(duration);
  }

  Duration() {
    return this.duration();
  }

  SetCurrentTime(currentTime: number) {
    this.currentTime.set(Math.max(0, Math.min(Math.floor(currentTime), this.duration())));
  }

  CurrentTime() {
    return this.currentTime();
  }


  PixelsToSeconds(pixels: number) {
    return Math.max(Math.min(Math.floor(pixels / this.pixelsPerSecondRatio()), this.duration()), 0);
  }

  SecondsToPixels(seconds: number) {
    return Math.floor(seconds * this.pixelsPerSecondRatio());
  }

  SelectEntity(entity: TimelineEntity) {
    this.selectedEntity?.UnSelect();
    this.selectedEntity = entity;
    this.selectedEntity.Select();
  }

  UnSelectEntity() {
    this.selectedEntity?.UnSelect();
    this.selectedEntity = null;
  }

  GetRulerX() {
    return this.rulerX;
  }

  SetRulerX(x: number) {
    this.rulerX = x;
  }
}
