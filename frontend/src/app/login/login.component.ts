import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
  })
  export class LoginComponent {
    username: string = '';
    password: string = '';
  
    constructor(private authService: AuthService) {}
  
    onSubmit() {
      this.authService.login({ username: this.username, password: this.password }).subscribe(
        (response) => {
          console.log('Login successful', response);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }