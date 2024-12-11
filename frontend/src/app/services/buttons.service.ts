import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ButtonsService {
    private baseUrl = 'http://127.0.0.1:8000/buttons'; // Backend URL

    constructor(private http: HttpClient) {}

    getEnjeux(): Observable<any> {
        return this.http.get(`${this.baseUrl}/enjeux`);
    }
    getQuestions(): Observable<any> {
        return this.http.get(`${this.baseUrl}/questions`);
    }
    getClientResponses(id_client:number): Observable<any> {
        return this.http.get(`${this.baseUrl}/responsesClient/?id_client=${id_client}`);
    }
    getReponse(id_reponse:number): Observable<any> {
        return this.http.get(`${this.baseUrl}/responses/?id_reponse=${id_reponse}`);
    }
    getQuestionsReponse(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/questionsReponses/`);
    }
    
    saveReponseClient(reponseData: any) {
        const headers = { 'Content-Type': 'application/json' };
        return this.http.post(`${this.baseUrl}/sauvegarderReponse/`, reponseData, { headers });
    }
    getTemplatesClient(id_client:number): Observable<any> {
        return this.http.get(`${this.baseUrl}/templates/?id_client=${id_client}`);
    }
    getQuestionsUser(): Observable<any> {
        const token = sessionStorage.getItem('token');
        console.log('[Front-End] Token récupéré du sessionStorage :', token);

        if (!token) {
            console.error('[Front-End] Aucun token trouvé dans sessionStorage.');
            return throwError(() => new Error('Token non disponible dans sessionStorage.'));
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');

        console.log('[Front-End] Requête prête à être envoyée au backend avec le token :', {
            url: `${this.baseUrl}/questionsUser/`,
            headers: {
                Authorization: headers.get('Authorization'),
                'Content-Type': headers.get('Content-Type')
            },
            method: 'GET'
        });

        // Ajouter un message explicite juste avant que la requête soit envoyée
        console.log('[Front-End] Le token est envoyé au backend.');

        // Effectuer la requête HTTP
        return this.http.get(`${this.baseUrl}/questionsUser/`, { headers }).pipe(
            tap((response) => {
                console.log('[Front-End] Réponse du backend reçue :', response);
            }),
            catchError((error) => {
                console.error('[Front-End] Erreur lors de l’envoi ou de la réception :', error);
                return throwError(() => new Error(error.message));
            })
        );
    }
    updateClient(id_client: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/set_client_termine/`, id_client);
    }
    
}
