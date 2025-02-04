import { Component, effect, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { App } from '../../../../../../App.component';
import { EditorPage } from '../../../../EditorPage.component';
import { ContextMenuItem } from '../../../../../../Components/ContextMenu/ContextMenu.component';
import ActionsService, { ActionStatus } from '../../../../../../Services/ActionsService';
import { ProjectService } from '../../../../../../Services/ProjectService';

export type OutlinerItemType = "folder"|"image"|"file";

export enum OutlinerItemActionType {
  RENAME, DELETE, OPEN
}

export type OutlinerItemActionEvent = {
  item: OutlinerItem,
  actionType: OutlinerItemActionType
}

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
  @ViewChild('nameField') private nameField!: ElementRef<HTMLElement>;
  @Input() type: OutlinerItemType = "image";
  @Input() id: string = "";
  @Input() name: string = "";
  @Input() extension: string = "";
  @Output() select = new EventEmitter<OutlinerItem>();
  @Output() actionRequest = new EventEmitter<OutlinerItemActionEvent>();
  protected isInRenameMode = signal<boolean>(false);

  constructor(private projectService: ProjectService, private actionsService: ActionsService) {
    effect(() => {
      const isInRenameMode = this.isInRenameMode();
      if (!isInRenameMode) {
        const newName = this.nameField.nativeElement.textContent?.trim();  
        if (newName === undefined) {
          this.nameField.nativeElement.textContent = this.name;
          return;
        }
        if (newName !== this.name.trim()) {
          this.actionsService.RegisterAction(this.DoRenameItem(newName), this.UndoRenameItem.bind(this));
        }
      }
    })
  }

  protected PreventCM = App.PreventContextMenu;

  Element() { return this.item.nativeElement; }

  IsInEditMode() { return this.isInRenameMode(); }

  protected OnClick(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0) {
      this.select.emit(this);
    }
  }

  DoRenameItem(newName: string) {
    return (() => {
      const oldName = this.name;
      this.type === 'folder' ? this.projectService.RenameFolder(this.id, newName)
      : this.projectService.RenameFile(this.id, newName);
      return {saveAction: true, returnVal: {id: this.id, type: this.type, oldName }}
    });
  }

  UndoRenameItem(val: any) {
    const type = val['type'];
    if (!type) {
      return false;
    }
    if (type === 'folder') {
      this.projectService.RenameFolder(val['id'], val['oldName']);
      this.name = val['oldName'];
    } else {
      this.projectService.RenameFile(val['id'], val['oldName']);
    }
    return true;
  }

  Select() {
    this.item.nativeElement.classList.add('selected');
    this.item.nativeElement.focus();
  }

  UnSelect() {
    this.item.nativeElement.classList.remove('selected');
    if (this.isInRenameMode()) {
      this.isInRenameMode.set(false);
    }
  }

  OnKeyDown(event: KeyboardEvent) {
  }

  OnNameKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.isInRenameMode.set(false);
      this.select.emit(this);
    }
  }

  Rename() {
    this.isInRenameMode.set(true);
    setTimeout(() => {
      this.nameField.nativeElement.focus();
      const s = window.getSelection();
      if (s && s.rangeCount > 0) {
        const r = s.getRangeAt(0);
        r.setStart(this.nameField.nativeElement.childNodes[0], this.name.length + 1);
      } else {
        this.isInRenameMode.set(false);
      }
    }, 10)
  }
}
