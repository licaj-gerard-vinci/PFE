import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
    private apiUrl = 'http://localhost:8000/reponses/engagements/list_engagements/client';

    constructor(private http: HttpClient) { }

    // La méthode prend un id_client comme paramètre
    getEngagements(id_client: number): Observable<any> {
        const token = sessionStorage.getItem('token');
        console.log('[Front-End] Token récupéré du sessionStorage :', token);

        if (!token) {
            console.error('[Front-End] Aucun token trouvé dans sessionStorage.');
            return throwError(() => new Error('Token non disponible dans sessionStorage.'));
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

        // Inclure id_client dans l'URL
        return this.http.get(`${this.apiUrl}/${id_client}/`, { headers });
    }
}
