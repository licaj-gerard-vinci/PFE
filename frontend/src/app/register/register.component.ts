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
                this.loginAfterRegister();
            },
            (error) => {
                console.error('Registration failed', error);
                this.registerError = 'Erreur lors de l\'inscription';
            }
        );
    }

    private loginAfterRegister() {
        this.authService.login({ email: this.email, mdp: this.password }).subscribe(
            (loginResponse) => {
                console.log('Login successful after registration', loginResponse);
                if (loginResponse.access) {
                    this.authService.storeTokens({ refresh: loginResponse.refresh });
                    window.location.href = '/'; // Redirige vers la page d'accueil
                }
            },
            (loginError) => {
                console.error('Login failed after registration', loginError);
                this.registerError = 'Inscription réussie, mais la connexion a échoué.';
            }
        );
    }
}
