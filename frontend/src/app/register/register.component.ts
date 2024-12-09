import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    nom: string = '';
    prenom: string = '';
    email: string = '';
    password: string = '';
    registerError: string = '';

    
    constructor(private authService: AuthService) {}

    onSubmit() {
        this.registerError = '';
        this.authService.register({ nom: this.nom, prenom: this.prenom, email: this.email, mdp: this.password }).subscribe(
            (response) => {
                console.log('Registration successful', response);
            },
            (error) => {
                console.error('Registration failed', error);
                this.registerError = 'Erreur lors de l\'inscription';
            }
        );
    }
}
