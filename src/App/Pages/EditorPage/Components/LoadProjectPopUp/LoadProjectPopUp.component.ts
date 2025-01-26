import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, ProjectService } from '../../../../Services/ProjectService';
import { Heading } from "../../../../Components/Heading/Heading.component";
import { FormInput } from "../../../../Components/FormInput/FormInput.component";
import { MainButton } from '../../../../Components/MainButton/MainButton.component';
import { SecondaryButton } from '../../../../Components/SecondaryButton/SecondaryButton.component';

enum LoadProjectPopUpDisplay {
  DISPLAY_LOAD, DISPLAY_CREATE
}

@Component({
  selector: 'LoadProjectPopUp',
  standalone: true,
  imports: [Heading, FormInput, ReactiveFormsModule, MainButton, SecondaryButton],
  templateUrl: './LoadProjectPopUp.component.html',
  styles: `
    .selected {
      background-color: #333333FF;
      border: 1px solid var(--color-skyBlue);
    }
  `
})
export class LoadProjectPopUp {
  LoadProjectPopUpDisplay = LoadProjectPopUpDisplay;
  protected selectedProjectItem: {project: Project, element: HTMLLIElement}|null = null;
  protected isVisible = signal(false);
  protected projects = signal<Project[]>([]);
  protected display = signal<LoadProjectPopUpDisplay>(LoadProjectPopUpDisplay.DISPLAY_LOAD);
  protected createProjectForm = new FormGroup({
    name: new FormControl('', {validators: [Validators.required]})
  })

  public constructor(private projectService: ProjectService) {}
  
  private resolveFn: ((val: boolean|PromiseLike<boolean>) => void)|null = null;
  Load() {
    this.isVisible.set(true);
    this.display.set(LoadProjectPopUpDisplay.DISPLAY_LOAD);    
    return new Promise<boolean>(async resolve => {
      this.projects.set(await this.projectService.GetProjects());
      this.resolveFn = resolve;
    });
  }

  New() {
    this.isVisible.set(true);
    this.display.set(LoadProjectPopUpDisplay.DISPLAY_CREATE);
    return new Promise<boolean>(async resolve => {
      this.projects.set(await this.projectService.GetProjects());
      this.resolveFn = resolve;
    });
  }

  Hide() {
    this.isVisible.set(false);
    if (this.resolveFn) {
      this.resolveFn(false);
    }
  }

  protected SetDisplay(display: LoadProjectPopUpDisplay) {
    this.display.set(display);
    if (display === LoadProjectPopUpDisplay.DISPLAY_CREATE) {
      const defaultProjName = "New Project";
      let projectName = defaultProjName;
      let count = 1;
      for (let i = 0; i < this.projects().length; i++) {
        if (this.projects()[i].name === projectName) {
          projectName = `${defaultProjName}(${count})`;
          count++;
          i = -1;
        }
      }
      this.createProjectForm.controls.name.setValue(projectName);
    }
  }

  protected async Create(event: SubmitEvent) {
    event.preventDefault();
    if (!this.createProjectForm.valid) {
      return;
    }
    const status = await this.projectService.CreateProject({name: this.createProjectForm.controls.name.value!});
    if (status) {
      if (this.resolveFn) {
        this.resolveFn(true);
        this.resolveFn = null;
        this.Hide();
      }
    }
  }

  protected SelectProject(event: MouseEvent, project: Project) {
    const target = (event.target as HTMLElement).closest('.project-item') as HTMLLIElement | null;
    if (target === null) {
      return;
    }
    if (this.selectedProjectItem !== null) {
      this.selectedProjectItem.element.classList.remove('selected');
    }
    target.classList.add('selected');
    this.selectedProjectItem = {element: target, project};
  }

  protected async LoadSelectedProject() {
    if (this.selectedProjectItem === null) {
      return;
    }
    if (await this.projectService.LoadProject(this.selectedProjectItem.project.id)) {
      if (this.resolveFn) {
        this.resolveFn(true);
        this.resolveFn = null;
      }
      this.Hide();
    }
  }

  protected async DeleteSelectedProject() {
    if (this.selectedProjectItem === null) {
      return;
    }
    if (await this.projectService.DeleteProject(this.selectedProjectItem.project.id)) {
      for (let i = 0; i < this.projects().length; i++) {
        if (this.projects()[i].id === this.selectedProjectItem.project.id) {
          this.projects().splice(i, 1);
          this.selectedProjectItem = null;
          break;
        }
      }
    }
  }
}
