import { Component, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { Menu } from './Menu/Menu.component';
import { SubMenu } from "./SubMenu/SubMenu.component";
import { MenuItem } from "./MenuItem/MenuItem.component";

export enum MenuAction {
  MENU_ACTION_PROJECT_NEW,
  MENU_ACTION_PROJECT_LOAD,
  MENU_ACTION_VIEW_RESET
}

@Component({
  selector: 'MenuBar',
  standalone: true,
  imports: [Menu, SubMenu, MenuItem],
  templateUrl: './MenuBar.component.html',
})  
export class MenuBar {
  Action = MenuAction;
  @Output() select = new EventEmitter<MenuAction>();
  @ViewChildren(Menu) protected menus!: QueryList<Menu>;

  protected Select(event: MouseEvent, action: MenuAction) {
    event.stopPropagation();
    this.select.emit(action);
    for (let i = 0; i < this.menus.length; i++) {
      this.menus.get(i)!.Close();
    }
  }

  OnHover(event: MouseEvent) {
    let open: Menu|null = null;
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus.get(i)?.IsExpanded()) {
        open = this.menus.get(i)!;
        break;
      }
    }
    const t = event.target as HTMLElement;
    if (open === null || open.menuButton.nativeElement.parentElement!.contains(t)) {
      return;
    }
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus.get(i)?.menuButton.nativeElement.parentElement!.contains(t)) {
        open.Close();
        this.menus.get(i)?.Show();
        return;
      }
    }
  }
}
