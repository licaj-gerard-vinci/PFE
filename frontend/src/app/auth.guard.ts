import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
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
}

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      // Si l'utilisateur n'est pas connecté, autorise l'accès
      return true;
    } else {
      // Si l'utilisateur est connecté, redirige vers le tableau de bord
      this.router.navigate(['/home']);
      return false;
    }
  }
}

