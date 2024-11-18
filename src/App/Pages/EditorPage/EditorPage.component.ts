import { Component, signal } from '@angular/core';
import { AuthService } from '../../Services/AuthService';
import { Router } from '@angular/router';
import { LoggedHeader } from "../../Components/LoggedHeader/LoggedHeader.component";
import { Outliner } from "./Components/Outliner/Outliner.component";
import { View } from './Components/View/View.component';
import { Properties } from "./Components/Properties/Properties.component";
import { Timeline } from './Components/Timeline/Timeline.component';
import { ResizeFlag, ResizeFlagBits } from './Components/EditorPanel/EditorPanel.component';
import { VerticalResizeBar } from './Components/VerticalResizeBar/VerticalResizeBar.component';
import { HorizontalResizeBar } from './Components/HorizontalResizeBar/HorizontalResizeBar.component';

export type Size = {
  w: number,
  h: number
}

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



@Component({
  selector: 'EditorPage',
  standalone: true,
  imports: [LoggedHeader, Outliner, View, Properties, Timeline, VerticalResizeBar, HorizontalResizeBar],
  templateUrl: './EditorPage.component.html',
  styleUrl: './EditorPage.component.css'
})
export class EditorPage {
  dimension: EditorPanelsInfo = {
    outlinerPanel: { 
      size: {w: 250, h: 0}, 
      resizeFlag: ResizeFlagBits.RESIZE_RIGHT
    },
    viewPanel: {
      size: {w: window.innerWidth - (250 * 2) - 32, h: window.innerHeight - 175 - (5 * 16)}, 
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
  };

  constructor(private auth: AuthService, private router: Router) {
    this.auth.IsLogged().then(isLogged => {
      if (!isLogged) {
        this.router.navigate(['login']);
      }
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
}
