import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { App } from '../../../../../../App.component';

export type OutlinerItemType = "folder"|"image"|"file";

@Component({
  selector: 'OutlinerItem',
  standalone: true,
  imports: [],
  templateUrl: './OutlinerItem.component.html',
  styles: `
    :host {width: 75px; height: fit-content; }
    .selected {
      background-color: #B6D3FD33;
      border-color: #B6D3FDAA;
    }
  `
})
export class OutlinerItem {
  @ViewChild('item') private item!: ElementRef<HTMLElement>;
  @Input() type: OutlinerItemType = "image";
  @Input() id: string = "";
  @Input() name: string = "";
  @Input() extension: string = "";
  @Output() select = new EventEmitter<OutlinerItem>();

  PreventCM = App.PreventContextMenu;
  OnClick(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0) {
      this.select.emit(this);
    } else if (event.button === 2) {
      event.stopPropagation();

    }
  }

  Select() {
    this.item.nativeElement.classList.add('selected');
  }

  UnSelect() {
    this.item.nativeElement.classList.remove('selected');
  }
}
