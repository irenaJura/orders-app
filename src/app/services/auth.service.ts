import { Injectable } from '@angular/core';
import { User } from '../modals/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser?: User | undefined;
  isValid = true;

  get isLoggedIn(): boolean {
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
