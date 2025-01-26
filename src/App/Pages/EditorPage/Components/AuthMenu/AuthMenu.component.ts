import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { AuthService } from '../../../../Services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'AuthMenu',
  standalone: true,
  imports: [],
  templateUrl: './AuthMenu.component.html',
})
export class AuthMenu {
  @ViewChild('authMenu') authMenu!: ElementRef<HTMLElement>;
  protected isVisible = signal(false);
  private static hideOnClickFn: ((event: MouseEvent) => void) | null = null;

  public constructor(private authService: AuthService, private router: Router) {}

  Show() {
    this.isVisible.set(true);
    if (AuthMenu.hideOnClickFn === null) {
      AuthMenu.hideOnClickFn = this.HideOnOutClick.bind(this);
    }
    document.body.addEventListener('click', AuthMenu.hideOnClickFn);
  }

  Hide() {
    this.isVisible.set(false);
  }

  async Logout() {
    if (await this.authService.Logout()) {
      this.router.navigate(['login']);
    }
  }

  HideOnOutClick(event: MouseEvent) {
    if (event.target === null) {
      return;
    }
    const target = event.target as HTMLElement;
    if (!this.authMenu.nativeElement.contains(target)) {
      this.Hide();
    }
  }
}
