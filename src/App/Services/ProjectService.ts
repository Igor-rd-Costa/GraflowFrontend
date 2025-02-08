import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { App } from "../App.component";
import { v4 } from 'uuid'

export type ProjectInfo = {
  id: string,
  name: string,
  creationDate: Date,
  lastAccessDate: Date
}

export type ProjectFolder = {
  id: string,
  parentId: string|null,
  name: string
}

export type ProjectFile = {
  id: string,
  parentId: string|null,
  name: string,
  extension: string,
  data: ArrayBuffer,
  size: number
}

export type ProjectAssets = {
  folders: ProjectFolder[],
  files: ProjectFile[],
}

export type ProjectTimelineLayer = {
  entities: []
}

export type ProjectTimeline = {
  duration: number // in seconds
  layers: ProjectTimelineLayer[]
}

export type Project = {info: ProjectInfo|null, assets: ProjectAssets, timeline: ProjectTimeline}

export type ProjectCreateInfo = {
  name: string
}

@Injectable()
export class ProjectService {
  private address = App.Backend()+"project/";
  private projects: ProjectInfo[] = [];
  private loadedProject: Project|null = null;
  private projectInfo = signal<ProjectInfo|null>(null);
  private projectAssets = signal<ProjectAssets|null>(null);
  private projectTimeline = signal<ProjectTimeline|null>(null);

  public constructor(private http: HttpClient) {
    const loadedProject = sessionStorage.getItem('loadedProject');
    if (loadedProject === null) {
      return;
    }
    const proj: ProjectInfo = JSON.parse(loadedProject);
    this.projectInfo.set(proj);
    this.loadedProject = {
      info: proj,
      assets: {
        files: [],
        folders: []
      },
      timeline: {
        duration: 0,
        layers: []
      }
    }
    this.projectAssets.set({
      folders: [],
      files: []
    });
  }

  Project():Project|null {
    return this.loadedProject;
  }

  ProjectInfo(): ProjectInfo|null {
    return this.projectInfo();
  }

  Assets(): ProjectAssets|null {
    return this.projectAssets();
  }

  async LoadProject(id: string): Promise<boolean> {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].id === id) {
        this.projectInfo.set({...this.projects[i]});
        this.projectAssets.set({files: [], folders: []});
        this.projectTimeline.set({duration: 0, layers: []});
        this.loadedProject = {
          info: this.projectInfo(),
          assets: {files: [], folders: []},
          timeline: {duration: 0, layers: []}
        };
        sessionStorage.setItem('loadedProject', JSON.stringify(this.projectInfo()));
        return true;
      }
    }
    const proj = await this.GetProject(id);
    if (proj === null) {
      return false;
    }
    this.projectInfo.set(proj);
    this.projectAssets.set({files: [], folders: []});
    this.projectTimeline.set({duration: 0, layers: []});
    this.loadedProject = {
      info: this.projectInfo(),
      assets: {files: [], folders: []},
      timeline: {duration: 0, layers: []}
    };
    sessionStorage.setItem('loadedProject', JSON.stringify(this.projectInfo()));
    return true;
  }

  GetProjects() {
    return new Promise<ProjectInfo[]>(resolve => {
      this.http.get<ProjectInfo[]>(this.address, {withCredentials: true}).subscribe({
        next: projects => {
          for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            project.lastAccessDate = new Date(project.lastAccessDate);
            project.creationDate = new Date(project.creationDate);
          }
          this.projects = [...projects];
          resolve(projects);
        },
        error: err => {
          console.error(err);
          resolve([]);
        }
      })
    });
  }

  GetProject(id: string) {
    return new Promise<ProjectInfo|null>(resolve => {
      this.http.get<ProjectInfo>(this.address+`id=${id}`, {withCredentials: true}).subscribe({
        next: project => {
          project.lastAccessDate = new Date(project.lastAccessDate);
          project.creationDate = new Date(project.creationDate);
          resolve(project);
        },
        error: err => {
          console.error(err);
          resolve(null);
        }
      });
    });
  }

  CreateProject(info: ProjectCreateInfo): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.post<string>(this.address, info, {withCredentials: true}).subscribe({
        next: id => {
          const now = new Date(Date.UTC(Date.now()));
          this.projectInfo.set({ id: id, name: info.name, creationDate: now, lastAccessDate: now });
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      });
    });
  }

  DeleteProject(id: string) {
    return new Promise<boolean>(resolve => {
      this.http.delete(this.address, {body: {id: id}, withCredentials: true}).subscribe({
        next: _ => {
          resolve(true);
        },
        error: err => {
          console.error(err);
          resolve(false);
        }
      });
    });
  }

  CreateFolder(parentFolder: string|null) {
    if (this.projectAssets() === null) {
      return null;
    }
    const assets = this.projectAssets()!;
    const folders = assets.folders;
    const id = v4();
    let folderNameBase = "New Folder";
    let folderName = folderNameBase;
    let folderNumber = 1;
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].parentId === parentFolder && folderName === folders[i].name) {
        folderName = folderNameBase + `(${folderNumber})`;
        folderNumber++;
        i = -1;
      }
    }
    const folder = {
      id: id,
      parentId: parentFolder,
      name: folderName,
    };
    folders.push(folder);
    this.projectAssets.set({
      folders: folders,
      files: assets.files
    });
    return folder;
  }

  AddFolder(folder: ProjectFolder) {
    if (this.projectAssets() === null) {
      return;
    }
    const assets = this.projectAssets()!;
    const folders = assets.folders;
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folder.id) {
        return;
      }
    }
    folders.push(folder);
    this.projectAssets.set({
      folders: folders,
      files: assets.files
    });
    return;
  }

  DeleteFolder(folderId: string) : boolean {
    if (this.projectAssets() === null) {
      return false;
    }
    const assets = this.projectAssets()!;
    const folders = assets.folders;
    const files = assets.files;
    let childFolderCount = 0;
    let childFileCount = 0;
    let folderIndex = -1;
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].parentId == folderId) {
        childFolderCount++;
      }
      if (folders[i].id === folderId) {
        folderIndex = i;
      }
    }
    if (folderIndex === -1) {
      return false;
    } 
    for (let i = 0; i < files.length; i++) {
      if (files[i].parentId === folderId) {
        childFileCount++;
      }
    }
    if (childFolderCount !== 0 || childFileCount !== 0) {
      //TODO await confirmation and delete child folders and files;
      console.error("Folder not empty. Behavior not implemented");
      return false;
    }
    folders.splice(folderIndex, 1);
    this.projectAssets.set({
      folders: folders,
      files: files
    });
    return true;
  }

  RenameFolder(folderId: string, newName: string): string|null {
    const assets = this.projectAssets();
    if (assets === null) {
      return null;
    }
    const folders = assets.folders;
    const baseName = newName;
    let name = baseName;
    let nameCount = 1;
    let renameIndex = -1;
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        renameIndex = i;
      }
    }
    if (renameIndex === -1) {
      return null;
    }
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].name === name && folders[i].parentId === folders[renameIndex].parentId) {
        name = baseName + `(${nameCount++})`;
        i = -1;
      }
    }
    folders[renameIndex].name = name;
    return name;
  }

  RenameFile(itemId: string, newName: string): string|null {
    const assets = this.projectAssets();
    if (!assets) {
      return null;
    }
    const files = assets.files;
    let renameIndex = -1;
    for (let i = 0; files.length; i++) {
      if (files[i].id === itemId) {
        renameIndex = i;
        break;
      }
    }
    if (renameIndex === -1) {
      return null;
    }
    const baseName = newName;
    let name = newName;
    let nameCount = 1;
    for (let i = 0; i < files.length; i++) {
      if (files[i].name === name && files[i].parentId === files[renameIndex].parentId && files[i].id !== files[renameIndex].id) {
        name = baseName + `(${nameCount})`;
        nameCount++;
        i = -1;
      }
    }
    files[renameIndex].name = name;
    return name;
  }

  AddAsset(name: string, type: string, data: ArrayBuffer, size: number, parentId?: string|null, id?: string) {
    const assets = this.projectAssets();
    if (!assets) {
      return;
    }
    const files = assets.files;
    if (!files) {
      return;
    }
    if (!id) {
      id = v4();
    }
    const file = {
      id,
      parentId: parentId ?? null,
      name,
      extension: type,
      data,
      size
    };
    files.push(file);
    this.projectAssets.set({
      folders: assets.folders,
      files: files
    });
    return file;
  }

  RemoveAsset(id: string): boolean {
    const assets = this.projectAssets();
    if (!assets) {
      return false;
    }
    const files = assets.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].id === id) {
        files.splice(i, 1);
        this.projectAssets.set({
          folders: assets.folders,
          files: files,
        });
        return true;
      }
    }
    return false;
  } 
}