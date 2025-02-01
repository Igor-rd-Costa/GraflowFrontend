import { Component, effect, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { EditorPanel } from '../EditorPanel/EditorPanel.component';
import { OutlinerItem } from './Components/OutlinerItem/OutlinerItem.component';
import { App } from '../../../../App.component';
import { EditorPage } from '../../EditorPage.component';
import { ProjectAssets, ProjectFile, ProjectFolder, ProjectService } from '../../../../Services/ProjectService';
import ActionsService from '../../../../Services/ActionsService';

@Component({
  selector: 'Outliner',
  standalone: true,
  imports: [EditorPanel, OutlinerItem],
  templateUrl: './Outliner.component.html',
})
export class Outliner {
  @ViewChild('outliner') outliner!: ElementRef<HTMLElement>;
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

  Test() {
    console.log(this.projectService.Assets()?.folders ?? null);
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
    console.log("Got here!");
    this.parentId.set(folderId);
  }

  PreventCM = App.PreventContextMenu;

  OnItemSelect(item: OutlinerItem) {
    this.selectedItem?.UnSelect();
    this.selectedItem = item;
    item.Select();
  }

  OnMouseDown(event: MouseEvent) {
    const files = this.outliner.nativeElement.children;
    for (let i = 0; i < files.length; i++) {
      if (files[i].contains(event.target as HTMLElement)) {
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

  DoCreateFolder() {
    return this.projectService.CreateFolder(this.parentId());
  }

  async UndoCreateFolder(doValue: any): Promise<boolean> {
    if (doValue) {
      return await this.projectService.DeleteFolder(doValue);
    }
    return false;
  }
}
