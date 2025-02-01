import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/AuthService';
import { Router } from '@angular/router';
import { Outliner } from "./Components/Outliner/Outliner.component";
import { View } from './Components/View/View.component';
import { Properties } from "./Components/Properties/Properties.component";
import { Timeline } from './Components/Timeline/Timeline.component';
import { VerticalResizeBar } from './Components/VerticalResizeBar/VerticalResizeBar.component';
import { HorizontalResizeBar } from './Components/HorizontalResizeBar/HorizontalResizeBar.component';
import { EditorHeader } from "./Components/EditorHeader/EditorHeader.component";
import { ProjectService } from '../../Services/ProjectService';
import { LoadProjectPopUp } from './Components/LoadProjectPopUp/LoadProjectPopUp.component';
import { MenuAction } from './Components/MenuBar/MenuBar.component';
import { ContextMenu } from "../../Components/ContextMenu/ContextMenu.component";
import ActionsService from '../../Services/ActionsService';

export type Size = {
  w: number,
  h: number
}

export type ResizeFlag = number;
export enum ResizeFlagBits {
  RESIZE_LEFT   = 0b0001,
  RESIZE_RIGHT  = 0b0010,
  RESIZE_TOP    = 0b0100,
  RESIZE_BOTTOM = 0b1000
};

export type EditorPanelsInfo = {
  outlinerPanel: {
    size: Size,
    resizeFlag: ResizeFlag
  },
  viewPanel: {
    size: Size,
    resizeFlag: ResizeFlag
  },
  propertiesPanel: {
    size: Size,
    resizeFlag: ResizeFlag
  },
  timelinePanel: {
    size: Size,
    resizeFlag: ResizeFlag
  }
}


function GetDefaultPanelDimensions(): EditorPanelsInfo {
  const width = 283;
  const height = 200; 
  return {
    outlinerPanel: { 
      size: {w: width, h: 0}, 
      resizeFlag: ResizeFlagBits.RESIZE_RIGHT
    },
    viewPanel: {
      size: {w: window.innerWidth - (width * 2) - 32, h: window.innerHeight - 32 - (1.5 * 16) - height }, 
      resizeFlag: ResizeFlagBits.RESIZE_LEFT | ResizeFlagBits.RESIZE_RIGHT | ResizeFlagBits.RESIZE_BOTTOM 
    },
    propertiesPanel: { 
      size: {w: width, h: 0}, 
      resizeFlag: ResizeFlagBits.RESIZE_LEFT 
    },
    timelinePanel: { 
      size: {w: 0, h: height},
      resizeFlag: ResizeFlagBits.RESIZE_LEFT | ResizeFlagBits.RESIZE_RIGHT | ResizeFlagBits.RESIZE_TOP 
    }
  }
}


@Component({
  selector: 'EditorPage',
  standalone: true,
  imports: [Outliner, View, Properties, Timeline, VerticalResizeBar, HorizontalResizeBar, EditorHeader, LoadProjectPopUp, ContextMenu],
  templateUrl: './EditorPage.component.html',
})
export class EditorPage {
  @ViewChild('main') main!: ElementRef<HTMLElement>;
  @ViewChild('pageWrapper') pageWrapper!: ElementRef<HTMLElement>;
  @ViewChild(LoadProjectPopUp) loadProjectPopUp!: LoadProjectPopUp;
  @ViewChild(ContextMenu) contextMenu!: ContextMenu;
  @ViewChild(View) viewPanel!: View;
  dimension: EditorPanelsInfo = GetDefaultPanelDimensions();
  static instance: EditorPage;

  constructor(private auth: AuthService, private router: Router, private projectService: ProjectService, private actionsService: ActionsService) {
    this.auth.IsLogged().then(async isLogged => {
      if (!isLogged) {
        this.router.navigate(['login']);
        return;
      }
      EditorPage.instance = this;
      window.addEventListener('resize', this.OnWindowResize.bind(this));
      window.addEventListener('keydown', this.OnWindowKeyDown.bind(this));
      if (this.projectService.Project() === null) {
        let loadedProject = false;
        do {
          this.UnfocusPage();
          loadedProject = await this.loadProjectPopUp.Load();
        } while (!loadedProject);
        this.FocusPage();
      }
      await this.viewPanel.Init();
      this.CallCanvasResize();
    });
  }

  static ContextMenu() {
    return this.instance.contextMenu;
  }

  outlineSum = 0;
  outlinerCols = signal<number>(3);
  OnOutlinerViewResize(offset: number) {
    this.outlineSum += offset;
    let newVal = this.dimension.outlinerPanel.size.w + this.outlineSum;
    let total = 0;
    const uVal = 83+8;
    const a =  Math.floor((this.dimension.outlinerPanel.size.w - 2) / uVal);
    const b = Math.floor(newVal / uVal);
    if (a === b) {
      return;
    }
    while ((total + uVal) <= newVal) {
      total += uVal;
    }
    const colCount = Math.floor(total / uVal);
    if (colCount < 2 || colCount > 4) {
      this.outlineSum = 0;
      return;
    }
    newVal = (colCount * uVal) + 10;
    this.dimension.viewPanel.size.w -= (newVal - this.dimension.outlinerPanel.size.w);
    this.dimension.outlinerPanel.size.w = newVal;
    
    this.outlineSum = 0;
    this.outlinerCols.set(colCount);
    this.CallCanvasResize();
  }

  OnViewPropertiesResize(offset: number) {
    const newVal = this.dimension.propertiesPanel.size.w - offset;
    if (newVal < 166 || newVal > 322) {
      return;
    }
    this.dimension.viewPanel.size.w += offset;
    this.dimension.propertiesPanel.size.w -= offset;
    this.CallCanvasResize();
  }

  OnViewTimelineResize(offset: number) {
    const newVal = this.dimension.timelinePanel.size.h - offset;
    if (newVal < 166 || newVal > 322) {
      return;
    }
    this.dimension.viewPanel.size.h += offset;
    this.dimension.timelinePanel.size.h -= offset;
    this.CallCanvasResize();
  }

  OnWindowResize() {
    const paddingW = 32;
    const paddingH = 24;

    const fixedComponentsW = this.dimension.outlinerPanel.size.w + this.dimension.propertiesPanel.size.w;
    const fixedComponentsH = this.dimension.timelinePanel.size.h;

    const w = parseInt(getComputedStyle(this.main.nativeElement).width) - paddingW - fixedComponentsW;
    const h = parseInt(getComputedStyle(this.main.nativeElement).height) - paddingH - fixedComponentsH;
    
    const ratioW = w / this.dimension.viewPanel.size.w;
    const ratioH = h / this.dimension.viewPanel.size.h;

    this.dimension.viewPanel.size.w *= ratioW;
    this.dimension.viewPanel.size.h *= ratioH;
    this.CallCanvasResize();
  }

  CallCanvasResize() {
    const event = new UIEvent('resize');
    const canvas = this.viewPanel.canvas.nativeElement;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    canvas.dispatchEvent(event);
  }

  async OnMenuSelect(action: MenuAction) {
    switch (action) {
      case MenuAction.MENU_ACTION_PROJECT_NEW: {
        this.UnfocusPage();
        await this.loadProjectPopUp.New();
        this.FocusPage();
      } break;
      case MenuAction.MENU_ACTION_PROJECT_LOAD: {
        this.UnfocusPage();
        await this.loadProjectPopUp.Load();
        this.FocusPage();
      } break;
      case MenuAction.MENU_ACTION_VIEW_RESET: {
        this.dimension = GetDefaultPanelDimensions();
      }
    }
  }

  OnWindowKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      console.log(event.key);
      if (event.key === "z") {
        this.actionsService.Undo();
        return;
      }
      if (event.key === "y") {
        this.actionsService.Redo();
        return;
      }
    }
  }

  UnfocusPage() {
    this.pageWrapper.nativeElement.style.filter = "blur(2px)";
    this.pageWrapper.nativeElement.style.pointerEvents = "none";
    this.pageWrapper.nativeElement.style.userSelect = "none";
  }
  
  FocusPage() {
    this.pageWrapper.nativeElement.style.filter = "";
    this.pageWrapper.nativeElement.style.pointerEvents = "";
    this.pageWrapper.nativeElement.style.userSelect = "";
  }
}
