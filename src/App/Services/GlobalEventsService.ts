import { Injectable } from "@angular/core";

type PointerEventFn = ((event: PointerEvent) => void);

type EventCallback<EventFn> = {
  name?: string,
  callback: EventFn
}

@Injectable()
export class GlobalEventsService {
  private pointerDownCallbacks: EventCallback<PointerEventFn>[] = [];
  private pointerUpCallbacks: EventCallback<PointerEventFn>[] = [];
  private pointerMoveCallbacks: EventCallback<PointerEventFn>[] = [];

  constructor() {
    document.addEventListener('pointerdown', this.OnPointerDownImpl.bind(this));
    document.addEventListener('pointerup', this.OnPointerUpImpl.bind(this));
    document.addEventListener('pointermove', this.OnPointerMoveImpl.bind(this));
  }

  OnPointerDown(callback: PointerEventFn, name?: string) {
    this.pointerDownCallbacks.push({name, callback});
  }

  OnPointerUp(callback: PointerEventFn, name?: string) {
    this.pointerUpCallbacks.push({name, callback});
  }

  OnPointerMove(callback: PointerEventFn, name?: string) {
    this.pointerMoveCallbacks.push({name, callback});
  }

  RemoveOnPointerDown(name: string) {
    for (let i = 0; i < this.pointerDownCallbacks.length; i++) {
      if (this.pointerDownCallbacks[i].name === name) {
        this.pointerDownCallbacks.splice(i, 1);
        return;
      }
    }
  }

  RemoveOnPointerUp(name: string) {
    for (let i = 0; i < this.pointerUpCallbacks.length; i++) {
      if (this.pointerUpCallbacks[i].name === name) {
        this.pointerUpCallbacks.splice(i, 1);
        return;
      }
    } 
  }

  RemoveOnPointerMove(name: string) {
    for (let i = 0; i < this.pointerMoveCallbacks.length; i++) {
      if (this.pointerMoveCallbacks[i].name === name) {
        this.pointerMoveCallbacks.splice(i, 1);
        return;
      }
    }
  }

  private OnPointerDownImpl(event: PointerEvent) {
    for (let i = 0; i < this.pointerDownCallbacks.length; i++) {
      this.pointerDownCallbacks[i].callback(event);
    }
  }

  private OnPointerUpImpl(event: PointerEvent) {
    for (let i = 0; i < this.pointerUpCallbacks.length; i++) {
      this.pointerUpCallbacks[i].callback(event);
    }
  }

  private OnPointerMoveImpl(event: PointerEvent) {
    for (let i = 0; i < this.pointerMoveCallbacks.length; i++) {
      this.pointerMoveCallbacks[i].callback(event);
    }
  }
}