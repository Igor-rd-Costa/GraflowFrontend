import { Component, EventEmitter, Output } from '@angular/core';
import { AuthMenu } from "../AuthMenu/AuthMenu.component";
import { MenuAction, MenuBar } from '../MenuBar/MenuBar.component';

@Component({
  selector: 'EditorHeader',
  standalone: true,
  imports: [AuthMenu, MenuBar],
  templateUrl: './EditorHeader.component.html',
  styleUrl: './EditorHeader.component.css'
})
export class EditorHeader {
  @Output() menuSelect = new EventEmitter<MenuAction>();

  constructor() {
  }

  GoToMainPage() {
    //this.router.navigate(['editor']);

  }

  MenuSelect(action: MenuAction) {
    this.menuSelect.emit(action);
  }
}
