import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RapportService {
  private apiUrl = 'http://127.0.0.1:8000/rapport'; // Chemin mis à jour

  constructor(private http: HttpClient) {}

  getRapport(): Observable<any> {
    const token = sessionStorage.getItem('token');
    console.log('[Front-End] Token récupéré du sessionStorage :', token);

    if (!token) {
        console.error('[Front-End] Aucun token trouvé dans sessionStorage.');
        return throwError(() => new Error('Token non disponible dans sessionStorage.'));
    }

    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

    

    // Effectuer la requête HTTP
    return this.http.get(`${this.apiUrl}`, { headers }).pipe(
        tap((response) => {
            console.log('[Front-End] Réponse du backend reçue :', response);
        }),
        catchError((error) => {
            console.error('[Front-End] Erreur lors de l’envoi ou de la réception :', error);
            return throwError(() => new Error(error.message));
        })
    );
}
}
