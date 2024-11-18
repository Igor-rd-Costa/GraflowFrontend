import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { Size } from '../../EditorPage.component';

export type ResizeFlag = number;
export enum ResizeFlagBits {
  RESIZE_LEFT   = 0b0001,
  RESIZE_RIGHT  = 0b0010,
  RESIZE_TOP    = 0b0100,
  RESIZE_BOTTOM = 0b1000
};

@Component({
  selector: 'EditorPanel',
  standalone: true,
  imports: [],
  templateUrl: './EditorPanel.component.html',
  styleUrl: './EditorPanel.component.css'
})
export class EditorPanel implements AfterViewInit {
  @ViewChild('panel') panel!: ElementRef<HTMLElement>;
  @Input() heading = "";
  @Input() resizeFlag: ResizeFlag = 0;
  @Input() size: Size = {w: 0, h: 0};
  private isHoveringBorder = signal<boolean>(false);
  private isResizing = signal<ResizeFlag|null>(null);

  ngAfterViewInit(): void {
      
  }

  private pastLocation: Size|null = null;
  private isHoveringLeftBorder = false;
  private isHoveringRightBorder = false;
  private isHoveringTopBorder = false;
  private isHoveringBottomBorder = false;
    
  OnPointerMove(event: PointerEvent) {
    // if (this.panel === null) {
    //   return;
    // }

    // const width = parseInt(getComputedStyle(this.panel.nativeElement).width);
    // const height = parseInt(getComputedStyle(this.panel.nativeElement).height);
    // const borderSize = (16 * 0.1);
    
    //this.isHoveringLeftBorder = ((this.resizeFlag & ResizeFlagBits.RESIZE_LEFT) === ResizeFlagBits.RESIZE_LEFT) && event.offsetX <= borderSize;
    //this.isHoveringRightBorder = ((this.resizeFlag & ResizeFlagBits.RESIZE_RIGHT) === ResizeFlagBits.RESIZE_RIGHT) && event.offsetX >= (width - (borderSize * 2));
    //this.isHoveringTopBorder = ((this.resizeFlag & ResizeFlagBits.RESIZE_TOP) === ResizeFlagBits.RESIZE_TOP) && event.offsetY <= borderSize;
    //this.isHoveringBottomBorder = ((this.resizeFlag & ResizeFlagBits.RESIZE_BOTTOM) === ResizeFlagBits.RESIZE_BOTTOM) && event.offsetY >= (height - (borderSize * 2));
    
    // if (this.isHoveringLeftBorder || this.isHoveringRightBorder || this.isHoveringTopBorder || this.isHoveringBottomBorder)
    // {
    //   this.isHoveringBorder.set(true);
    //   if (this.isHoveringLeftBorder || this.isHoveringRightBorder) {
    //     this.panel.nativeElement.style.cursor = 'col-resize';
    //   } else if (this.isHoveringTopBorder || this.isHoveringBottomBorder) {
    //     this.panel.nativeElement.style.cursor = 'row-resize';
    //   }
    // } else {
    //   if (this.isHoveringBorder() && !this.isResizing()) {
    //     this.panel.nativeElement.style.cursor = 'default';
    //     this.isHoveringBorder.set(false);
    //   }
    // }

    // if(this.isResizing() === null || this.pastLocation === null) {
    //   return;
    // }

    // if ((this.isResizing()! & ResizeFlagBits.RESIZE_LEFT) === ResizeFlagBits.RESIZE_LEFT 
    // || (this.isResizing()! & ResizeFlagBits.RESIZE_RIGHT) === ResizeFlagBits.RESIZE_RIGHT) {
    //   const offsetX = event.offsetX - this.pastLocation.w;
    //   console.log("OffsetX:", offsetX);
    //   this.panel.nativeElement.style.width = width + offsetX + 'px';
    // }
    // this.pastLocation = { w: event.offsetX, h: event.offsetY };
    // console.log("Update location:", this.pastLocation);
  }

  OnPointerLeave(event: PointerEvent) {
    // if (this.isHoveringBorder()) {
    //   this.isResizing.set(false);
    //   this.panel.nativeElement.style.userSelect = '';
    // }
  }

  OnPointerDown(event: PointerEvent) {
    if (this.isHoveringBorder()) {
      
      // const hLeft = this.isHoveringLeftBorder === true ? 1 : 0;
      // const hRight = this.isHoveringRightBorder === true ? 1 : 0;
      // const hTop = this.isHoveringTopBorder === true ? 1 : 0;
      // const hBottom = this.isHoveringBottomBorder === true ? 1 : 0;
      // this.isResizing.set( hLeft | (hRight << 1)  | (hTop << 2) | (hBottom << 3));
      // this.panel.nativeElement.style.userSelect = 'none';
      // this.pastLocation = {w: event.offsetX, h: event.offsetY};
      // console.log("Set location:", this.pastLocation);
    }
  }

  OnPointerUp(event: PointerEvent) {
    if (this.isResizing()) {
      // this.isResizing.set(null);
      // this.panel.nativeElement.style.userSelect = '';
      // this.pastLocation = null;
      // console.log("Pointer up");
    }
  }
}
