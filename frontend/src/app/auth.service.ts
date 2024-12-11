import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://127.0.0.1:8000/auth'; // Backend URL

    constructor(private http: HttpClient) {}

    register(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register/`, data);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login/`, data);
    }

    verifyToken(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/verify-token/`, data);
    }

    // Fonction pour récupérer le token d'accès (access token) stocké
  getAccessToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Fonction pour stocker les tokens dans la session
  storeTokens(tokens: { refresh: string }): void {
    sessionStorage.setItem('token', tokens.refresh);
  }

  // Fonction pour supprimer le token
  clearToken(): void {
    sessionStorage.removeItem('token');
  }

    // Fonction pour vérifier si l'utilisateur est connecté
    /*isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }*/

        isLoggedIn(): boolean {
          return !!sessionStorage.getItem('token'); // Vérifie si un token est stocké
        }
       
}
