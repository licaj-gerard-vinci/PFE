import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      // L'utilisateur est connecté, autoriser l'accès à la page
      return true;
    } else {
      // L'utilisateur n'est pas connecté, rediriger vers la page de login
      this.router.navigate(['/login']); // Ou la route de ton choix
      return false;
    }
  }

  canDeactivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      // L'utilisateur est connecté, autoriser l'accès à la page
      return true;
    } else {
      // L'utilisateur n'est pas connecté, rediriger vers la page de login
      this.router.navigate(['/home']); // Ou la route de ton choix
      return false;
    }
  }
}
