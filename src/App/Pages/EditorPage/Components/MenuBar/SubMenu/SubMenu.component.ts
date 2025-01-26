import { Component, ContentChildren, ElementRef, Input, QueryList, Renderer2, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'SubMenu',
  standalone: true,
  imports: [],
  templateUrl: './SubMenu.component.html',
})
export class SubMenu {
  @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;
  @ContentChildren(SubMenu) subMenus!: QueryList<SubMenu>;
  @Input() icon: string|null = null;
  @Input({required: true}) heading = "";
  protected isVisible = signal(false);
  protected left = signal('0px');

  constructor(private ngRenderer: Renderer2, private el: ElementRef<HTMLElement>) {}

  OnClick(e: MouseEvent) {
    e.stopPropagation();
    this.Show();
  }
  
  private Show() {
    this.isVisible.set(true);
    const left = this.menuButton.nativeElement.getBoundingClientRect().width + "px";
    this.left.set(left);
    this. docClickRemFn = this.ngRenderer.listen("body", "click", this.OnDocumentClick.bind(this));
  }

  private Hide() {
    this.isVisible.set(false);
    this.docClickRemFn();
  }

  Close() {
    console.log("Found " + this.subMenus.length + " submenus!");
    for (let i = 0; i < this.subMenus.length; i++) {
      this.subMenus.get(i)!.Close();
    }
    this.Hide();
    console.log("Closing", this.el.nativeElement);
  }

  private docClickRemFn: () => void = () => {};
  OnDocumentClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (!this.el.nativeElement.contains(t)) {
      this.Hide();
    }
  }
}
