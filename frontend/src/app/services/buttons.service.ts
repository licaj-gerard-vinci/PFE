import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';

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
    getSimulatedLogin(): Observable<any> {
        return this.http.get(`${this.baseUrl}/testLogin/`);
      }
}
