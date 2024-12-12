import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  private apiUrl = 'http://localhost:8000/reponses'; // Backend URL de base

  constructor(private http: HttpClient) {}

  // Ajouter une vérification pour un client spécifique
  addVerification(clientId: number, adminId: number): Observable<any> {
    const url = `${this.apiUrl}/verifications/${clientId}/add/`;
    const body = { id_admin: adminId };
    return this.http.post(url, body).pipe(
      tap((response) => console.log(`[VerificationService] Vérifications ajoutées:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de l'ajout de vérifications:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Valider une réponse spécifique
  validateReponse(verificationId: number, adminId: number): Observable<any> {
    const url = `${this.apiUrl}/verifications/validerReponse/${verificationId}/`;
    const body = { id_admin: adminId };
    return this.http.post(url, body).pipe(
      tap((response) => console.log(`[VerificationService] Réponse validée:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de la validation de la réponse:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Récupérer les vérifications pour un client
  getVerificationsParClient(clientId: number): Observable<any> {
    const url = `${this.apiUrl}/verifications/client/${clientId}/`;
    return this.http.get(url).pipe(
      tap((response) => console.log(`[VerificationService] Vérifications récupérées:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de la récupération des vérifications:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Supprimer une réponse client spécifique
  deleteReponseClient(reponseClientId: number): Observable<any> {
    const url = `${this.apiUrl}/reponse_client/${reponseClientId}/delete/`;
    return this.http.delete(url).pipe(
      tap((response) => console.log(`[VerificationService] Réponse client supprimée:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de la suppression de la réponse client:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Mettre à jour une réponse client
  updateReponseClient(reponseClientId: number, reponseData: any): Observable<any> {
    const url = `${this.apiUrl}/reponse_client/reponse_libre/${reponseClientId}/update/`;
    return this.http.put(url, reponseData).pipe(
      tap((response) => console.log(`[VerificationService] Réponse client mise à jour:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de la mise à jour de la réponse client:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Ajouter une nouvelle réponse client
  addReponseClient(reponseData: any): Observable<any> {
    const url = `${this.apiUrl}/reponse_client/reponse_verifier/add`;
    return this.http.post(url, reponseData).pipe(
      tap((response) => console.log(`[VerificationService] Réponse client ajoutée:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de l'ajout de la réponse client:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Récupérer les engagements pour un client
  getEngagements(clientId: number): Observable<any> {
    const url = `${this.apiUrl}/engagements/list_engagements/client/${clientId}/`;
    return this.http.get(url).pipe(
      tap((response) => console.log(`[VerificationService] Engagements récupérés:`, response)),
      catchError((error) => {
        console.error(`[VerificationService] Erreur lors de la récupération des engagements:`, error);
        return throwError(() => new Error(error.message));
      })
    );
  }
}
