import { Component, signal } from '@angular/core';
import { AuthService } from '../../../../Services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'AuthMenu',
  standalone: true,
  imports: [],
  templateUrl: './AuthMenu.component.html',
  styleUrl: './AuthMenu.component.css'
})
export class AuthMenu {
  protected isVisible = signal(false);
  private static hideOnClickFn: ((event: MouseEvent) => void) | null = null;

  public constructor(private authService: AuthService, private router: Router) {
  }

  Show() {
    this.isVisible.set(true);
    const button = document.getElementById('auth-menu');
    button?.classList.add('selected');
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
    if (target.closest('#auth-menu') === null) {
      this.Hide();
    }
  }
}
