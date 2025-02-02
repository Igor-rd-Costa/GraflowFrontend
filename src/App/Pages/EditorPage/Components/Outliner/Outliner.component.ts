import { Component, ContentChildren, effect, ElementRef, Input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';
import { OutlinerItem, OutlinerItemType } from './Components/OutlinerItem/OutlinerItem.component';
import { App } from '../../../../App.component';
import { EditorPage } from '../../EditorPage.component';
import { ProjectAssets, ProjectFile, ProjectFolder, ProjectInfo, ProjectService } from '../../../../Services/ProjectService';
import ActionsService, { ActionStatus } from '../../../../Services/ActionsService';

@Component({
  selector: 'Outliner',
  standalone: true,
  imports: [EditorPanel, OutlinerItem],
  templateUrl: './Outliner.component.html',
})
export class Outliner {
  @ViewChild('outliner') outliner!: ElementRef<HTMLElement>;
  @ViewChildren(OutlinerItem) items!: QueryList<OutlinerItem>;
  @Input() colCount: number = 3;
  selectedItem: OutlinerItem|null = null;
  parentId = signal<string|null>(null);
  projectFolders: ProjectFolder[] = [];
  projectFiles: ProjectFile[] = [];
  protected heading = signal<string>("Outliner");

  constructor(private projectService: ProjectService, private actionsService: ActionsService) {
    effect(() => {
      const pId = this.parentId();
      const files = this.projectService.Assets();
      if (files === null) {
        return;
      }
      this.projectFolders = files.folders.filter(f => f.parentId === pId) ?? [];
      this.projectFiles = files.files.filter(f => f.parentId === pId) ?? [];
    });
  }

  GetFolderPathString() {
    const pId = this.parentId();
    const folders = this.projectService.Assets()?.folders;
    if (pId === null || folders === undefined) {
      return "/";
    }
    let str = "";
    let lookFor = pId;
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === lookFor) {
        str = "/" + folders[i].name + str;
        if (folders[i].parentId === null) {
          break;
        } else {
          lookFor = folders[i].parentId!;
          i = -1;
        }
      }
    }
    return str;
  }

  GoToHomeFolder() {
    this.parentId.set(null);
  }

  BackFolder() {
    const pId = this.parentId();
    const folders = this.projectService.Assets()?.folders;
    if (pId === null || folders === undefined) {
      return;
    }
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === pId) {
        this.parentId.set(folders[i].parentId);
        return;
      }
    }
  }

  OpenFolder(folderId: string) {
    this.parentId.set(folderId);
  }

  PreventCM = App.PreventContextMenu;

  OnItemSelect(item: OutlinerItem) {
    this.selectedItem?.UnSelect();
    this.selectedItem = item;
    item.Select();
  }

  OnKeyDown(event: KeyboardEvent) {
    if (this.selectedItem && !this.selectedItem.IsInEditMode()) {
      switch(event.key) {
        case "F2": {
          event.preventDefault();
          event.stopPropagation();
          this.selectedItem.Rename();
        } break;
        case "Delete": {
          event.preventDefault();
          event.stopPropagation();
          this.actionsService.RegisterAction(this.DoDeleteItem(this.selectedItem.id, this.selectedItem.type), this.UndoDeleteItem.bind(this));
        }
      }
      return;
    }
  }

  OnMouseDown(event: MouseEvent) {
    this.outliner.nativeElement.focus();
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items.get(i)!;
      if (item.Element().contains(event.target as HTMLElement)) {
        if (event.button === 2) {
          event.stopPropagation();
          EditorPage.ContextMenu().Show([
            {heading: 'Delete', callback: this.DeleteFolderCallback(item.id, item.type), closeOnCallback: true },
            {heading: 'Rename', callback: this.RenameItemCallback(item.id), closeOnCallback: true }
          ], event.clientX, event.clientY);
        }
        return;
      }
    }
    this.selectedItem?.UnSelect();
    if (event.button === 2) {
      event.stopPropagation();
      EditorPage.ContextMenu().Show([
        {heading: 'Import File', callback: () => {}, closeOnCallback: true},
        {heading: 'Create Folder', callback: this.CreateFolderCallback.bind(this), closeOnCallback: true},
      ], event.clientX, event.clientY);
    }
  }

  CreateFolderCallback() {
    this.actionsService.RegisterAction(this.DoCreateFolder.bind(this), this.UndoCreateFolder.bind(this));
  }

  DeleteFolderCallback(itemId: string, itemType: OutlinerItemType) {
    return () => {
      this.actionsService.RegisterAction(this.DoDeleteItem(itemId, itemType), this.UndoDeleteItem.bind(this));
    };
  }

  RenameItemCallback(itemId: string) {
    return () => {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items.get(i)?.id === itemId) {
          this.items.get(i)!.Rename();
        }
      }
    }
  }

  DoCreateFolder(redoVal: any): ActionStatus {
    if (redoVal) {
      this.projectService.AddFolder(redoVal);
      return {saveAction: true, returnVal: redoVal };
    } else {
      const folder = this.projectService.CreateFolder(this.parentId());
      if (folder) {
        return {saveAction: true, returnVal: folder };
      }
    }
    return {saveAction: false}
  }
  
  async UndoCreateFolder(doValue: any): Promise<boolean> {
    if (doValue) {
      if (await this.projectService.DeleteFolder(doValue['id'])) {
        if (this.parentId() === doValue['id']) {
          this.parentId.set(null);
        }
        return true;
      } 
    }
    return false;
  }

  DoDeleteItem(itemId: string, itemType: OutlinerItemType) {
    let item: ProjectFolder|ProjectFile|null = null;
    const items = itemType === 'folder' ? this.projectFolders : this.projectFiles;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        item = items[i];
        break;
      }
    }
    if (item === null) {
      return () => { return {saveAction: false } }
    }
    return (async () => {
      if (itemType === 'folder') {
        if (await this.projectService.DeleteFolder(itemId)) {
          const status: ActionStatus = {
            saveAction: true,
            returnVal: item
          }
          return status;
        };
      }
      return {saveAction: false}
    }).bind(this);
  }

  UndoDeleteItem(val: any) {
    this.projectService.AddFolder(val);
    return true;
  }
}
