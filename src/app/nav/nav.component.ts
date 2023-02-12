import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  pageTitle = 'Orders Management';
  loading = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get email(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.email;
    }
    return '';
  }

  constructor(
    private authService: AuthService, private router: Router) {
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login')
    console.log('Log out');
  }
}
