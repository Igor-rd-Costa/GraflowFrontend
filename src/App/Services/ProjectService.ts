import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";

export type Project = {
  id: string,
  name: string,
  creationDate: Date,
  lastAccessDate: Date
}

export type ProjectCreateInfo = {
  name: string
}

@Injectable()
export class ProjectService {
  private address = App.Backend()+"project/";
  private projects: Project[] = [];
  private loadedProject: Project|null = null;

  public constructor(private http: HttpClient) {
    const loadedProject = sessionStorage.getItem('loadedProject');
    if (loadedProject === null) {
      return;
    }
    const proj: Project = JSON.parse(loadedProject);
    this.loadedProject = proj;
  }

  Project(): Project|null {
    return this.loadedProject;
  }

  async LoadProject(id: string): Promise<boolean> {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].id === id) {
        this.loadedProject = {...this.projects[i]};
        sessionStorage.setItem('loadedProject', JSON.stringify(this.loadedProject));
        return true;
      }
    }
    const proj = await this.GetProject(id);
    if (proj === null) {
      return false;
    }
    this.loadedProject = proj;
    sessionStorage.setItem('loadedProject', JSON.stringify(this.loadedProject));
    return true;
  }

  GetProjects() {
    return new Promise<Project[]>(resolve => {
      this.http.get<Project[]>(this.address, {withCredentials: true}).subscribe({
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
    return new Promise<Project|null>(resolve => {
      this.http.get<Project>(this.address+`id=${id}`, {withCredentials: true}).subscribe({
        next: project => {
          project.lastAccessDate = new Date(project.lastAccessDate);
          project.creationDate = new Date(project.creationDate);
          resolve(project);
        },
        error: err => {
          console.error(err);
          resolve(null);
        }
      })
    });
  }

  CreateProject(info: ProjectCreateInfo): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.post<string>(this.address, info, {withCredentials: true}).subscribe({
        next: id => {
          const now = new Date(Date.UTC(Date.now()));
          this.loadedProject = { id: id, name: info.name, creationDate: now, lastAccessDate: now };
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
}