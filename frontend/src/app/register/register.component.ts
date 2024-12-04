import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    username: string = '';
    email: string = '';
    password: string = '';
    
    constructor(private authService: AuthService) {}

    onSubmit() {
        this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe(
            (response) => {
                console.log('Registration successful', response);
            },
            (error) => {
                console.error('Registration failed', error);
            }
        );
    }
}
