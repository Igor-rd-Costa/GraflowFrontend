import { Component, ContentChildren, ElementRef, Input, QueryList, Renderer2, signal, ViewChild } from '@angular/core';
import { SubMenu } from '../SubMenu/SubMenu.component';

@Component({
  selector: 'Menu',
  standalone: true,
  imports: [],
  templateUrl: './Menu.component.html',
  styleUrl: './Menu.component.css'
})
export class Menu {
  @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;
  @ContentChildren(SubMenu) protected subMenus!: QueryList<SubMenu>;
  @Input({required: true}) heading = "";
  protected isVisible = signal(false);
  top = "24px";
  protected buttonWidth = signal("0px");

  constructor(private ngRenderer: Renderer2, private el: ElementRef<HTMLElement>) {
  }

  OnClick(e: MouseEvent) {
    this.Show();
  }
  
  private Show() {
    this.isVisible.set(true);
    this.menuButton.nativeElement.classList.add('opened');
    this.buttonWidth.set(this.menuButton.nativeElement.getBoundingClientRect().width - 2 + "px");
    this.onBodyClickRemoveFn = this.ngRenderer.listen("body", "click", this.OnBodyClick.bind(this));
  }

  Close() {
    for (let i = 0; i < this.subMenus.length; i++) {
      this.subMenus.get(i)!.Close();
    }
    this.Hide();
    console.log("Closing", this.el.nativeElement);
  }

  private Hide() {
    this.isVisible.set(false);
    this.menuButton.nativeElement.classList.remove('opened');
    this.onBodyClickRemoveFn();
  }


  private onBodyClickRemoveFn: () => void = () => {};
  OnBodyClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    console.log("Here", t);
    if (!this.el.nativeElement.contains(t)) {
      this.Hide();
    }
  }
}
