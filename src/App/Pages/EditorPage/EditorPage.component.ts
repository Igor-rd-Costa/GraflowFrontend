import { Component, ElementRef, ViewChild } from '@angular/core';
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
  return {
    outlinerPanel: { 
      size: {w: 250, h: 0}, 
      resizeFlag: ResizeFlagBits.RESIZE_RIGHT
    },
    viewPanel: {
      size: {w: window.innerWidth - (250 * 2) - 32, h: window.innerHeight - 32 - (1.5 * 16) - 175 }, 
      resizeFlag: ResizeFlagBits.RESIZE_LEFT | ResizeFlagBits.RESIZE_RIGHT | ResizeFlagBits.RESIZE_BOTTOM 
    },
    propertiesPanel: { 
      size: {w: 250, h: 0}, 
      resizeFlag: ResizeFlagBits.RESIZE_LEFT 
    },
    timelinePanel: { 
      size: {w: 0, h: 175},
      resizeFlag: ResizeFlagBits.RESIZE_LEFT | ResizeFlagBits.RESIZE_RIGHT | ResizeFlagBits.RESIZE_TOP 
    }
  }
}


@Component({
  selector: 'EditorPage',
  standalone: true,
  imports: [Outliner, View, Properties, Timeline, VerticalResizeBar, HorizontalResizeBar, EditorHeader, LoadProjectPopUp],
  templateUrl: './EditorPage.component.html',
  styleUrl: './EditorPage.component.css'
})
export class EditorPage {
  @ViewChild('main') main!: ElementRef<HTMLElement>;
  @ViewChild(LoadProjectPopUp) loadProjectPopUp!: LoadProjectPopUp;
  @ViewChild(View) viewPanel!: View;
  dimension: EditorPanelsInfo = GetDefaultPanelDimensions();

  constructor(private auth: AuthService, private router: Router, private projectService: ProjectService) {
    this.auth.IsLogged().then(async isLogged => {
      if (!isLogged) {
        this.router.navigate(['login']);
        return;
      }
      window.addEventListener('resize', this.OnWindowResize.bind(this));
      if (this.projectService.Project() === null) {
        let loadedProject = false;
        do {
          loadedProject = await this.loadProjectPopUp.Load();
          if (!loadedProject) {
            console.log("Canceled Load!");
          }
        } while (!loadedProject);
      } 
      await this.viewPanel.Init();
    });
  }

  OnOutlinerViewResize(offset: number) {
    if (this.dimension.outlinerPanel.size.w + offset < 106) {
      return;
    }
    this.dimension.outlinerPanel.size.w += offset;
    this.dimension.viewPanel.size.w -= offset;
  }

  OnViewPropertiesResize(offset: number) {
    if (this.dimension.propertiesPanel.size.w - offset < 106) {
      return;
    }
    this.dimension.viewPanel.size.w += offset;
    this.dimension.propertiesPanel.size.w -= offset;
  }

  OnViewTimelineResize(offset: number) {
    if (this.dimension.timelinePanel.size.h - offset < 106) {
      return;
    }
    this.dimension.viewPanel.size.h += offset;
    this.dimension.timelinePanel.size.h -= offset;
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
  }

  OnMenuSelect(action: MenuAction) {
    switch (action) {
      case MenuAction.MENU_ACTION_PROJECT_NEW: {
        this.loadProjectPopUp.New();
      } break;
      case MenuAction.MENU_ACTION_PROJECT_LOAD: {
        this.loadProjectPopUp.Load();
      } break;
      case MenuAction.MENU_ACTION_VIEW_RESET: {
        this.dimension = GetDefaultPanelDimensions();
      }
    }
  }
}
