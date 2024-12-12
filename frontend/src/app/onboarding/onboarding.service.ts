import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private apiUrl = 'http://localhost:8000/onboarding';

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/`);
  }

  submitAnswers(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit/`, data);
  }
}
