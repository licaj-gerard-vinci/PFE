import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
  })
  export class LoginComponent {
    email: string = '';
    password: string = '';
    loginError: string = '';
    token: string = '';
    email2: string = '';
  
    constructor(private authService: AuthService) {}
  
    onSubmit() {
      this.loginError = '';
      this.authService.login({ email: this.email, mdp: this.password }).subscribe(
        (response) => {
          console.log('Login successful', response);
          if (response.access) {
            this.authService.storeTokens({ refresh: response.refresh });
            window.location.href = '/'; // Redirect to home page
          }
        },
        (error) => {
          console.error('Login failed', error);
          this.loginError = 'Email ou mot de passe incorrect';
        }
      );
    }
  }