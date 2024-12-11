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
      const email = this.decodeToken(token).email; // Récupère l'email du token
      if (!this.isAdminEmail(email)) {
        return true; // Autorisé si l'email n'appartient pas à un admin
      }
    }
    this.router.navigate(['/login']); // Rediriger si ce n'est pas un client
    return false;
  }

  private isAdminEmail(email: string): boolean {
    return /@admin|BetterBusiness/i.test(email);
  }

  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      return null;
    }
  }
}
