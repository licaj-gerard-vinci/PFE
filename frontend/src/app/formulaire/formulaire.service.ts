import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Permet d'utiliser ce service dans toute l'application sans le déclarer ailleurs
})
export class QuestionsService {
  private apiUrl = 'http://127.0.0.1:8000/questions/'; 

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les questions
  getQuestionsReponse(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}questionsReponses/`);
  }


  saveReponseClient(reponseData: any) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.apiUrl}sauvegarderReponse/`, reponseData, { headers });
  }
}
