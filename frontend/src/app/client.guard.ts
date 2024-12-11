import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClientGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getAccessToken();
    if (token) {
      const email = this.decodeToken(token)?.email;
      if (!this.isAdminEmail(email)) {
        return true; // Autorise l'accès si l'utilisateur est un client
      }
    }

    this.router.navigate(['/login']); // Redirige vers la page de connexion si non autorisé
    return false;
  }

  

  private isAdminEmail(email: string): boolean {
    return /@admin|@betterbusiness/i.test(email); // Vérifie si l'email contient admin ou betterbusiness
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
