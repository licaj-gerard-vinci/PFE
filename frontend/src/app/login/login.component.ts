import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
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
  
    constructor(private authService: AuthService) {}
  
    onSubmit() {
      this.loginError = '';
      this.authService.login({ email: this.email, mdp: this.password }).subscribe(
        (response) => {
          console.log('Login successful', response);
          if (response.access) {
            this.authService.storeTokens({ refresh: response.refresh });
            //this.veryfyToken();
            window.location.href = '/'; // Redirect to home page
          }
        },
        (error) => {
          console.error('Login failed', error);
          this.loginError = 'Email ou mot de passe incorrect';
        }
      );
    }

    /*veryfyToken() {
      this.authService.verifyToken({ token: this.authService.getAccessToken() }).subscribe(
        (response) => {
          console.log('Token verified', response);
        },
        (error) => {
          console.error('Token verification failed', error);
        }
      );
    }*/
  }

  