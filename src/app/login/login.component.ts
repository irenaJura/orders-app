import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage = '';
  pageTitle = 'Login Form';

  constructor(private authService: AuthService, private router: Router) { }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const email = loginForm.form.value.email;
      const password = loginForm.form.value.password;
      this.authService.login(email, password);
      this.router.navigate(['/orders']);

    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }
}
