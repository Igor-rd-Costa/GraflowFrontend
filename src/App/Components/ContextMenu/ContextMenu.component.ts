import { Component, effect, ElementRef, isDevMode, signal, ViewChild } from '@angular/core';
import { App } from '../../App.component';

export type ContextMenuItemCallback = () => void;

export type ContextMenuItem = {
  heading: string,
  items?: ContextMenuItem[],
  callback?: ContextMenuItemCallback,
  closeOnCallback: boolean
}

@Component({
  selector: 'ContextMenu',
  standalone: true,
  imports: [],
  templateUrl: './ContextMenu.component.html',
})
export class ContextMenu {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  isVisible = signal<boolean>(false);
  items = signal<ContextMenuItem[]>([]);
  position = signal<{x: number, y: number}>({x: 0, y: 0});
  constructor() {
    if (isDevMode()) {
      effect(() => {
        const menuItems = this.items();
        const validatorFn = (items: ContextMenuItem[]) => {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.items !== undefined && item.callback !== undefined) {
              console.error(`'${item.heading}' menu item callback prevents children from being shown on click`);
            } else if (item.items !== undefined) {
              validatorFn(item.items);
            }
          }
        };
        validatorFn(menuItems);
      });
    }
  }

  protected PreventCM = App.PreventContextMenu;

  OnItemClick(event: MouseEvent, callback: ContextMenuItemCallback, closeOnCallback: boolean) {
    event.preventDefault();
    event.stopPropagation();
    callback();
    if (closeOnCallback) {
      this.Hide();
    }
  }

  Show(items: ContextMenuItem[], x: number, y: number) {
    this.items.set(items);
    this.position.set({x, y});
    this.isVisible.set(true);
    const onGlobalCLick = (event: MouseEvent) => {
      if (event.target == null || this.menu.nativeElement.contains(event.target as HTMLElement)) {
        return;
      }
      this.Hide();
      document.removeEventListener('mousedown', onGlobalCLick);
    };
    document.addEventListener('mousedown', onGlobalCLick);
  }

  Hide() {
    this.isVisible.set(false);
    this.items.set([]);
  }
}
