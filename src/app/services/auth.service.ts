import { Injectable } from '@angular/core';
import { User } from '../modals/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser?: User | undefined;
  redirectUrl = '';
  isValid = true;

  get isLoggedIn(): boolean {
    // console.log(!!this.currentUser)
    return !!this.currentUser;
  }

  constructor() { }

  login(email: string, password: string): void {
    this.currentUser = { email, password };
  }

  logout(): void {
    this.currentUser = undefined;
  }
}
