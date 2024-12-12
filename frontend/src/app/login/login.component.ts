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

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.loginError = '';
    // Vérifie que les champs sont remplis
    if (!this.email || !this.password) {
      this.loginError = 'Erreur: tous les champs doivent être remplis.';
      return;
    }
    this.authService.login({ email: this.email, mdp: this.password }).subscribe(
      (response) => {
        console.log('Login successful', response);
        if (response.access) {
          this.authService.storeTokens({ refresh: response.refresh });

          // Décoder le token pour vérifier l'email
          const payload = this.decodeToken(response.access);
          if (payload) {
            console.log('Decoded token payload:', payload);

            if (this.isAdminEmail(payload.email)) {
              // Redirige vers le tableau de bord si c'est un admin
              window.location.href = '/dashboard';
            } else {
              // Redirige vers la page d'accueil si c'est un client
              window.location.href = '/home';
            }
          } else {
            console.error('Payload is null or invalid');
            this.loginError = 'Erreur lors de la vérification du rôle';
          }
        }
      },
      (error) => {
        console.error('Login failed', error);
        this.loginError = 'Email ou mot de passe incorrect';
      }
    );
  }

  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  private isAdminEmail(email: string): boolean {
    // Vérifie si l'email contient "admin" ou "betterbusiness"
    return /@admin|@betterbusiness/i.test(email);
  }
}
