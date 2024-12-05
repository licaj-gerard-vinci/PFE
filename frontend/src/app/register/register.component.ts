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
    nom: string = '';
    prenom: string = '';
    email: string = '';
    password: string = '';
    
    constructor(private authService: AuthService) {}

    onSubmit() {
        this.authService.register({ nom: this.nom, prenom: this.prenom, email: this.email, mdp: this.password }).subscribe(
            (response) => {
                console.log('Registration successful', response);
            },
            (error) => {
                console.error('Registration failed', error);
            }
        );
    }
}
