import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
 styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    // Exposez les méthodes Angular à `window`
    (window as any).isLoggedIn = this.isLoggedIn.bind(this);
    (window as any).logout = this.logout.bind(this);
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const isLogged = this.authService.isLoggedIn();
    console.log('isLoggedIn called, result:', isLogged); // Debug
    return isLogged;
  }

  // Déconnexion
  logout(): void {
    console.log('Logout called'); // Debug
    this.authService.clearToken(); // Supprime le token
    window.location.href = '/login'; // Redirige vers la page de connexion
  }
}